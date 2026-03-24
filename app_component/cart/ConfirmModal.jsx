import { Modal, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';
import themes from '../../themes'; // Điều chỉnh lại đường dẫn themes cho đúng

const { colors, typography } = themes;

const ConfirmModal = ({ visible, onClose, onConfirm, title, description, confirmText = "Đồng ý", cancelText = "Huỷ bỏ" }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            {/* Vùng mờ bên ngoài: Bấm vào đây sẽ đóng Modal */}
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                
                {/* Vùng nội dung Modal: Bắt sự kiện rỗng để ngăn không cho lệnh đóng lan vào trong */}
                <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                    <Text style={[typography.subBold, styles.modalTitle]}>{title}</Text>
                    
                    {description && (
                        <Text style={[typography.bodyRegular, styles.modalDesc]}>{description}</Text>
                    )}
                    
                    {/* Nút Đồng ý */}
                    <TouchableOpacity style={styles.modalBtnConfirm} onPress={onConfirm} activeOpacity={0.8}>
                        <Text style={[typography.subMedium, styles.modalBtnConfirmText]}>{confirmText}</Text>
                    </TouchableOpacity>
                    
                    {/* Nút Hủy bỏ */}
                    <TouchableOpacity style={styles.modalBtnCancel} onPress={onClose} activeOpacity={0.8}>
                        <Text style={[typography.subMedium, styles.modalBtnCancelText]}>{cancelText}</Text>
                    </TouchableOpacity>
                </Pressable>
                
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Nền đen mờ 40%
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: colors.WHITE,
        borderRadius: 16, // Bo góc cong nhiều hơn cho giống thiết kế
        padding: 24,
        alignItems: 'center',
    },
    modalTitle: {
        color: colors.BLACK,
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalDesc: {
        color: colors.GRAY,
        fontSize: 14,
        marginBottom: 25,
        textAlign: 'center',
    },
    modalBtnConfirm: {
        backgroundColor: colors.MAIN, // Màu xanh chủ đạo
        width: '100%',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15, // Tăng khoảng cách với chữ Hủy bỏ một chút cho dễ bấm
    },
    modalBtnConfirmText: {
        color: colors.WHITE,
        fontSize: 16,
    },
    modalBtnCancel: {
        width: '100%',
        paddingVertical: 10,
        alignItems: 'center',
    },
    modalBtnCancelText: {
        color: colors.BLACK,
        fontSize: 16,
        textDecorationLine: 'underline', // Thường nút Hủy dạng text trơn sẽ có gạch chân để user biết có thể bấm
    }
});

export default ConfirmModal;