// Script migration đơn giản để khắc phục lỗi kích thước nội dung
// Copy và paste script này vào console của trình duyệt sau khi đã đăng nhập

async function runSimpleMigration() {
    console.log('🚀 Bắt đầu migration...');
    
    try {
        // 1. Kiểm tra bảng task_content
        const { data: tableCheck, error: tableError } = await supabase
            .from('task_content')
            .select('id')
            .limit(1);
        
        if (tableError) {
            console.error('❌ Bảng task_content chưa được tạo. Vui lòng chạy fix-content-size.sql trước.');
            return;
        }
        
        console.log('✅ Bảng task_content đã tồn tại');
        
        // 2. Lấy danh sách tasks có nội dung lớn
        const { data: tasksToMigrate, error: tasksError } = await supabase
            .from('tasks')
            .select('id, name, submission_link')
            .not('submission_link', 'is', null)
            .neq('submission_link', '')
            .neq('submission_link', '[CONTENT_SAVED]')
            .not('submission_link', 'like', 'http%');
        
        if (tasksError) {
            console.error('❌ Lỗi khi lấy danh sách tasks:', tasksError);
            return;
        }
        
        console.log(`📋 Tìm thấy ${tasksToMigrate.length} tasks cần migration`);
        
        if (tasksToMigrate.length === 0) {
            console.log('✅ Không có task nào cần migration');
            return;
        }
        
        // 3. Hiển thị danh sách
        console.log('📝 Danh sách tasks sẽ được migration:');
        tasksToMigrate.forEach(task => {
            console.log(`   - Task ${task.id}: ${task.name} (${task.submission_link.length} ký tự)`);
        });
        
        // 4. Xác nhận
        const confirm = window.confirm(
            `Bạn có chắc chắn muốn migration ${tasksToMigrate.length} tasks?\n\n` +
            'Điều này sẽ:\n' +
            '- Chuyển nội dung từ submission_link sang task_content\n' +
            '- Cập nhật submission_link thành [CONTENT_SAVED]\n' +
            '- Không thể hoàn tác sau khi chạy'
        );
        
        if (!confirm) {
            console.log('❌ Migration đã bị hủy');
            return;
        }
        
        // 5. Thực hiện migration
        let successCount = 0;
        let errorCount = 0;
        
        for (const task of tasksToMigrate) {
            try {
                // Chỉ migration những nội dung dài (> 100 ký tự)
                if (task.submission_link.length <= 100) {
                    console.log(`⏭️ Bỏ qua task ${task.id} (nội dung ngắn: ${task.submission_link.length} ký tự)`);
                    continue;
                }
                
                                 // Insert vào task_content
                 const { error: insertError } = await supabase
                     .from('task_content')
                     .upsert({
                         task_id: parseInt(task.id), // Đảm bảo task_id là INTEGER
                         content_type: 'review',
                         content: task.submission_link
                     });
                
                if (insertError) {
                    console.error(`❌ Lỗi khi insert task_content cho task ${task.id}:`, insertError);
                    errorCount++;
                    continue;
                }
                
                // Cập nhật submission_link thành marker
                const { error: updateError } = await supabase
                    .from('tasks')
                    .update({
                        submission_link: '[CONTENT_SAVED]'
                    })
                    .eq('id', task.id);
                
                if (updateError) {
                    console.error(`❌ Lỗi khi cập nhật submission_link cho task ${task.id}:`, updateError);
                    errorCount++;
                    continue;
                }
                
                console.log(`✅ Migration thành công task ${task.id}: ${task.name}`);
                successCount++;
                
                // Delay nhỏ để tránh rate limit
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error(`❌ Lỗi khi migration task ${task.id}:`, error);
                errorCount++;
            }
        }
        
        // 6. Hiển thị kết quả
        console.log('\n🎉 === KẾT QUẢ MIGRATION ===');
        console.log(`✅ Thành công: ${successCount} tasks`);
        console.log(`❌ Lỗi: ${errorCount} tasks`);
        console.log(`📊 Tổng cộng: ${tasksToMigrate.length} tasks`);
        
        if (successCount > 0) {
            console.log('\n🎯 Migration hoàn tất! Bây giờ bạn có thể lưu nội dung review mà không bị lỗi kích thước.');
        }
        
    } catch (error) {
        console.error('❌ Lỗi trong quá trình migration:', error);
    }
}

// Hàm kiểm tra trạng thái
async function checkMigrationStatus() {
    console.log('🔍 Kiểm tra trạng thái migration...');
    
    try {
        const { count: contentCount } = await supabase
            .from('task_content')
            .select('*', { count: 'exact', head: true });
        
        const { count: markerCount } = await supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true })
            .eq('submission_link', '[CONTENT_SAVED]');
        
        console.log('📊 === TRẠNG THÁI MIGRATION ===');
        console.log(`📄 Số lượng task_content: ${contentCount}`);
        console.log(`🏷️ Số lượng tasks có marker [CONTENT_SAVED]: ${markerCount}`);
        
        if (contentCount === markerCount) {
            console.log('✅ Migration hoàn tất và đồng bộ');
        } else {
            console.log('⚠️ Migration chưa đồng bộ hoàn toàn');
        }
        
    } catch (error) {
        console.error('❌ Lỗi khi kiểm tra trạng thái:', error);
    }
}

// Export functions
window.runSimpleMigration = runSimpleMigration;
window.checkMigrationStatus = checkMigrationStatus;

console.log('🚀 Migration script đã được load.');
console.log('📝 Sử dụng:');
console.log('   - runSimpleMigration() để chạy migration');
console.log('   - checkMigrationStatus() để kiểm tra trạng thái');
