import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Upload, Button, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getProfileByEmail, upsertProfile, UserProfile } from '../utils/profileStore';

type ProfileEditorProps = {
	visible: boolean;
	onClose: () => void;
	currentEmail?: string;
	currentName?: string;
};

const ProfileEditor: React.FC<ProfileEditorProps> = ({ visible, onClose, currentEmail, currentName }) => {
	const [form] = Form.useForm<UserProfile>();
	const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (visible) {
			const existing = getProfileByEmail(currentEmail);
			form.setFieldsValue({
				email: currentEmail || existing?.email,
				name: existing?.name || currentName,
				avatarUrl: existing?.avatarUrl,
			} as any);
			setAvatarUrl(existing?.avatarUrl);
		}
	}, [visible, currentEmail, currentName]);

	const onFinish = (values: any) => {
		const profile: UserProfile = {
			email: (values.email || '').toLowerCase(),
			name: values.name,
			avatarUrl: avatarUrl,
		};
		upsertProfile(profile);
		onClose();
	};

	return (
		<Modal open={visible} onCancel={onClose} onOk={() => form.submit()} title="تعديل الملف الشخصي" okText="حفظ" cancelText="إلغاء" destroyOnClose>
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Form.Item label="البريد الإلكتروني" name="email" rules={[{ required: true, message: 'أدخل البريد الإلكتروني' }]}
					extra="يُستخدم كمفتاح لتعريف الملف الشخصي">
					<Input type="email" disabled={!!currentEmail} />
				</Form.Item>
				<Form.Item label="الاسم" name="name" rules={[{ required: true, message: 'أدخل الاسم' }]}> 
					<Input />
				</Form.Item>
				<Form.Item label="الصورة الرمزية">
					<Space>
						<Input placeholder="رابط الصورة (اختياري)" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
						<Upload beforeUpload={() => false} maxCount={1} onChange={async (info) => {
							const file = info.file.originFileObj as File | undefined;
							if (!file) return;
							const reader = new FileReader();
							reader.onload = () => setAvatarUrl(reader.result as string);
							reader.readAsDataURL(file);
						}}>
							<Button icon={<UploadOutlined />}>رفع صورة</Button>
						</Upload>
					</Space>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ProfileEditor;


