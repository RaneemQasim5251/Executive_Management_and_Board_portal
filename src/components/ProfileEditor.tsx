import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Upload, Button, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getProfileByEmail, upsertProfile, UserProfile } from '../utils/profileStore';

type ProfileEditorProps = {
	visible: boolean;
	onClose: () => void;
	currentEmail?: string;
	currentName?: string;
	onSave?: () => void;
};

const ProfileEditor: React.FC<ProfileEditorProps> = ({ visible, onClose, currentEmail, currentName, onSave }) => {
	const [form] = Form.useForm<UserProfile>();
	const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (visible) {
			const existing = getProfileByEmail(currentEmail);
			const avatarUrlValue = existing?.avatarUrl;
			form.setFieldsValue({
				email: currentEmail || existing?.email,
				name: existing?.name || currentName,
				avatarUrl: avatarUrlValue,
			} as any);
			setAvatarUrl(avatarUrlValue);
		}
	}, [visible, currentEmail, currentName]);

	const onFinish = (values: any) => {
		const finalAvatarUrl = avatarUrl || values.avatarUrl;
		console.log('Form values:', values);
		console.log('Current avatarUrl state:', avatarUrl);
		console.log('Final avatarUrl:', finalAvatarUrl);
		
		const profile: UserProfile = {
			email: (values.email || '').toLowerCase(),
			name: values.name,
			avatarUrl: finalAvatarUrl,
		};
		console.log('Saving profile:', profile);
		upsertProfile(profile);
		console.log('Profile saved, triggering refresh');
		onSave?.();
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
				<Form.Item name="avatarUrl" style={{ display: 'none' }}>
					<Input />
				</Form.Item>
				<Form.Item label="الصورة الرمزية">
					<Space direction="vertical" style={{ width: '100%' }}>
						<Space>
							<Input 
								placeholder="رابط الصورة (اختياري)" 
								value={avatarUrl} 
								onChange={(e) => {
									setAvatarUrl(e.target.value);
									form.setFieldValue('avatarUrl', e.target.value);
								}} 
							/>
							<Upload beforeUpload={() => false} maxCount={1} onChange={async (info) => {
								const file = info.file.originFileObj as File | undefined;
								if (!file) return;
								const reader = new FileReader();
								reader.onload = () => {
									const dataUrl = reader.result as string;
									setAvatarUrl(dataUrl);
									form.setFieldValue('avatarUrl', dataUrl);
								};
								reader.readAsDataURL(file);
							}}>
								<Button icon={<UploadOutlined />}>رفع صورة</Button>
							</Upload>
						</Space>
						{avatarUrl && (
							<div style={{ textAlign: 'center', marginTop: 8 }}>
								<img 
									src={avatarUrl} 
									alt="Avatar Preview" 
									style={{ 
										width: 80, 
										height: 80, 
										borderRadius: '50%', 
										objectFit: 'cover',
										border: '2px solid #e5e7eb'
									}} 
								/>
								<div style={{ fontSize: '12px', color: '#6b7280', marginTop: 4 }}>
									معاينة الصورة
								</div>
							</div>
						)}
					</Space>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ProfileEditor;


