import React, { useState, useRef, useEffect } from 'react';
import { 
  Layout, 
  Typography, 
  Form, 
  Input, 
  Button, 
  Divider, 
  message, 
  Card,
  Space,
  Progress,
  Alert,
  Modal
} from 'antd';
import { 
  LockOutlined, 
  MailOutlined, 
  AppleOutlined, 
  GoogleOutlined, 
  WindowsOutlined,
  CameraOutlined,
  ScanOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import WelcomeOverlay from '../../components/WelcomeOverlay';
import { findExecutiveByEmailOrPhone, getPoliteTitle } from '../../utils/executives';

import '../../styles/world-class-design-system.css';

const { Content } = Layout;
const { Title, Text, Link } = Typography;

const WorldClassLogin: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [themeSwitcherVisible, setThemeSwitcherVisible] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'biometric'>('password');
  const [idMode, setIdMode] = useState<'email' | 'phone'>('email');

  // Palm Login Demo State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<'success' | 'failed' | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Cleanup camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        
        // Ensure video is playing
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(error => {
            console.error('Error playing video:', error);
            message.error(t('Unable to start camera. Please try again.'));
            setCameraActive(false);
          });
        };
      }
    } catch (error) {
      console.error('Camera access error:', error);
      message.error(t('Camera access denied. Please allow camera permissions.'));
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
      
      // Clear the video source to ensure it's completely reset
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const simulatePalmScan = async () => {
    if (!cameraActive) {
      await startCamera();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setScanning(true);
    setScanProgress(0);
    setScanResult(null);

    try {
      for (let i = 0; i <= 100; i += 10) {
        setScanProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const capturedFrame = captureFrame();
      setCapturedImage(capturedFrame);

      await new Promise(resolve => setTimeout(resolve, 500));

      const recognitionSuccess = Math.random() > 0.2; // 80% success rate

      if (recognitionSuccess) {
        setScanResult('success');
        message.success(t('Palm Authentication Successful'));
        
        // Simulate successful login with demo user data
        const demoUserData = {
          id: 'demo-exec-001',
          name: 'CEO Al Jeri',
          email: 'ceo@aljeri.com',
          role: 'ceo',
          department: 'Executive Leadership',
          auth_method: 'palm_biometric_demo',
        };

        // Completely stop and reset camera
        stopCamera();
        setCameraActive(false);
        setScanning(false);
        setScanProgress(0);
        setCapturedImage(null);

        // Navigate to dashboard after successful login
        navigate('/');
      } else {
        setScanResult('failed');
        message.error(t('Palm not recognized. Please try again.'));
        
        // Completely stop and reset camera
        stopCamera();
        setCameraActive(false);
        setScanning(false);
        setScanProgress(0);
        setCapturedImage(null);
      }
    } catch (error) {
      setScanResult('failed');
      message.error(t('Palm scan failed. Please try again.'));
      
      // Completely stop and reset camera
      stopCamera();
      setCameraActive(false);
      setScanning(false);
      setScanProgress(0);
      setCapturedImage(null);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setScanProgress(0);
    setCapturedImage(null);
  };

  const [matched, setMatched] = useState<{ FullName: string; Title?: string } | null>(null);

  const handleLogin = async (values: any) => {
    try {
      // Phone/email recognition route
      const maybe = findExecutiveByEmailOrPhone(values?.email || values?.phone);
      if (maybe) {
        setMatched({ FullName: maybe.FullArabicName || maybe.FullName, Title: maybe.Title });
        // do not auto-dismiss; proceed only on CTA
        return;
      }

      // Demo credentials
      const demoEmail = 'ceo@aljeri.com';
      const demoPassword = 'AlJeri2023!';

      if (values.email === demoEmail && values.password === demoPassword) {
        message.success(t('Login Successful'));
        
        // Simulate successful login with demo user data
        const demoUserData = {
          id: 'demo-exec-001',
          name: 'CEO Al Jeri',
          email: 'ceo@aljeri.com',
          role: 'ceo',
          department: 'Executive Leadership',
          auth_method: 'password_demo',
        };

        // Navigate to dashboard after successful login
        navigate('/');
      } else {
        message.error(t('Invalid Credentials'));
      }
    } catch (error) {
      message.error(t('Login Failed'));
    }
  };

  return (
    <Layout 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: 'var(--color-ivory)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Content style={{ maxWidth: 450, width: '100%', padding: 24 }}>
        <Card 
          className="world-class-card micro-interaction"
          style={{ 
            padding: 32,
            textAlign: 'center'
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <Title 
              level={2} 
              style={{ 
                color: 'var(--color-primary-dark-blue)', 
                marginBottom: 8 
              }}
            >
              {t('Executive Portal')}
            </Title>
            <Text type="secondary">
              {t('Secure Access for Board & Executive Leadership')}
            </Text>
          </div>

          {loginMethod === 'password' ? (
            <Form
              name="login"
              onFinish={handleLogin}
              layout="vertical"
              initialValues={{
                email: 'ceo@aljeri.com',
                password: 'AlJeri2023!'
              }}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Button type={idMode === 'email' ? 'primary' : 'default'} onClick={() => setIdMode('email')}>
                  {t('Email')}
                </Button>
                <Button type={idMode === 'phone' ? 'primary' : 'default'} onClick={() => setIdMode('phone')}>
                  {t('Phone')}
                </Button>
              </div>

              {idMode === 'email' ? (
              <Form.Item
                name="email"
                rules={[{ 
                  required: true, 
                  message: t('Please input your email!'),
                  type: 'email' 
                }]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder={t('Email Address')}
                  className="world-class-input"
                />
              </Form.Item>
              ) : (
              <Form.Item
                name="phone"
                rules={[{ required: true, message: t('Please input your phone!') }]}
              >
                <Input 
                  placeholder={t('Saudi phone e.g. 050 569 7669')}
                  className="world-class-input"
                />
              </Form.Item>
              )}

              <Form.Item
                name="password"
                rules={[{ 
                  required: true, 
                  message: t('Please input your password!') 
                }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder={t('Password')}
                  className="world-class-input"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block
                  className="world-class-button"
                  style={{ 
                    backgroundColor: 'var(--color-primary-dark-blue)',
                    borderColor: 'var(--color-primary-dark-blue)'
                  }}
                >
                  {t('Sign In')}
                </Button>
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                <Button 
                  icon={<AppleOutlined />} 
                  className="world-class-button"
                  style={{ width: 60 }}
                />
                <Button 
                  icon={<GoogleOutlined />} 
                  className="world-class-button"
                  style={{ width: 60 }}
                />
                <Button 
                  icon={<WindowsOutlined />} 
                  className="world-class-button"
                  style={{ width: 60 }}
                />
              </div>

              <Divider>{t('Or')}</Divider>

              <Button 
                block
                className="world-class-button"
                onClick={() => {
                  setLoginMethod('biometric');
                  startCamera();
                }}
                style={{ 
                  marginTop: 16,
                  backgroundColor: 'var(--color-primary-dark-blue)',
                  borderColor: 'var(--color-primary-dark-blue)',
                  color: 'white' // Explicitly set text color to white
                }}
              >
                {t('Use Biometric Login')}
              </Button>
            </Form>
          ) : (
            <div>
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ fontSize: '48px', marginBottom: '8px' }}
              >
                🖐️
              </motion.div>

              <Title level={4}>
                {t('Palm Authentication')}
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                {t('Position your palm in front of the camera')}
              </Text>

              <div style={{ 
                position: 'relative', 
                display: 'inline-block',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid var(--color-primary-dark-blue)',
                background: '#000',
                marginBottom: 16
              }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '320px',
                    height: '240px',
                    objectFit: 'cover',
                    display: cameraActive ? 'block' : 'none',
                  }}
                />
                
                {!cameraActive && (
                  <div style={{
                    width: '320px',
                    height: '240px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f5f5f5',
                    color: '#999',
                  }}>
                    <Space direction="vertical" style={{ textAlign: 'center' }}>
                      <CameraOutlined style={{ fontSize: '48px' }} />
                      <Text type="secondary">{t('Camera Preview')}</Text>
                    </Space>
                  </div>
                )}

                {scanning && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        width: '100px',
                        height: '100px',
                        border: '3px solid var(--color-primary-dark-blue)',
                        borderRadius: '50%',
                        marginBottom: '16px',
                      }}
                    />
                    <Text strong style={{ color: 'white', fontSize: '16px' }}>
                      {t('Scanning Palm...')}
                    </Text>
                    <Progress 
                      percent={scanProgress} 
                      size="small" 
                      strokeColor="var(--color-primary-dark-blue)"
                      style={{ width: '200px', marginTop: '8px' }}
                    />
                  </div>
                )}

                {scanResult && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: scanResult === 'success' 
                      ? 'rgba(0, 128, 0, 0.9)' 
                      : 'rgba(255, 0, 0, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {scanResult === 'success' ? (
                        <CheckCircleOutlined style={{ fontSize: '64px', color: 'white' }} />
                      ) : (
                        <CloseCircleOutlined style={{ fontSize: '64px', color: 'white' }} />
                      )}
                    </motion.div>
                    <Text strong style={{ color: 'white', fontSize: '18px', marginTop: '16px' }}>
                      {scanResult === 'success' ? t('Palm Verified!') : t('Palm Not Recognized')}
                    </Text>
                  </div>
                )}
              </div>

              <canvas ref={canvasRef} style={{ display: 'none' }} />

              <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }} size="middle">
                <Button
                  type={cameraActive ? "default" : "primary"}
                  icon={<CameraOutlined />}
                  onClick={cameraActive ? stopCamera : startCamera}
                  disabled={scanning}
                  className="world-class-button"
                >
                  {cameraActive ? t('Stop Camera') : t('Start Camera')}
                </Button>

                <Button
                  type="primary"
                  icon={<ScanOutlined />}
                  onClick={simulatePalmScan}
                  disabled={!cameraActive || scanning}
                  loading={scanning}
                  className="world-class-button"
                  style={{
                    backgroundColor: 'var(--color-primary-dark-blue)',
                    borderColor: 'var(--color-primary-dark-blue)'
                  }}
                >
                  {scanning ? t('Scanning...') : t('Scan Palm')}
                </Button>

                {scanResult && (
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={resetScan}
                    className="world-class-button"
                  >
                    {t('Try Again')}
                  </Button>
                )}
              </Space>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Link onClick={() => {
                  stopCamera(); // Stop camera when switching back to password
                  setLoginMethod('password');
                }}>
                  {t('Use Password Login')}
                </Link>
              </div>
            </div>
          )}
        </Card>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button 
            type="text"
            onClick={() => setThemeSwitcherVisible(true)}
          >
            {t('Customize Portal')}
          </Button>
        </div>
      </Content>

      <ThemeSwitcher 
        visible={themeSwitcherVisible} 
        onClose={() => setThemeSwitcherVisible(false)} 
      />
      {matched && (
        <WelcomeOverlay
          FullName={matched.FullName}
          Title={matched.Title || ''}
          onContinue={() => navigate('/')}
          // omit autoDismissMs to require manual CTA; set to a number to enable auto
        />
      )}
    </Layout>
  );
};

export default WorldClassLogin;
