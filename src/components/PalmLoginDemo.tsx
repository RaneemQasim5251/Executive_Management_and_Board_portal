import React, { useRef, useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Alert,
  Progress,
  Avatar,
  Modal,
  Row,
  Col,
  Tag,
  Divider,
} from 'antd';
import {
  CameraOutlined,
  ScanOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  SafetyOutlined,
  EyeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

interface PalmLoginDemoProps {
  onSuccess?: (userData: any) => void;
  onError?: (error: string) => void;
}

export const PalmLoginDemo: React.FC<PalmLoginDemoProps> = ({ onSuccess, onError }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<'success' | 'failed' | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Demo registered palm images (base64 encoded small images)
  const registeredPalms = [
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Demo placeholder
  ];

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
      console.log('🎥 Starting camera for palm authentication...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user', // Front camera preferred
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        console.log('✅ Camera started successfully');
      }
    } catch (error) {
      console.error('❌ Camera access failed:', error);
      onError?.(t('Camera access denied. Please allow camera permissions for palm authentication.'));
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
      console.log('🛑 Camera stopped');
    }
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64 image
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const simulatePalmScan = async () => {
    if (!cameraActive) {
      await startCamera();
      // Wait a moment for camera to initialize
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setScanning(true);
    setScanProgress(0);
    setScanResult(null);

    try {
      // Simulate scanning progress
      for (let i = 0; i <= 100; i += 10) {
        setScanProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Capture current frame
      const capturedFrame = captureFrame();
      setCapturedImage(capturedFrame);

      // Simulate palm recognition processing
      await new Promise(resolve => setTimeout(resolve, 500));

      // Demo logic: 80% chance of success for demonstration
      const recognitionSuccess = Math.random() > 0.2; // 80% success rate

      if (recognitionSuccess) {
        setScanResult('success');
        console.log('✅ Palm authentication successful (demo mode)');
        
        // Simulate successful login with demo user data
        const demoUserData = {
          id: 'demo-exec-001',
          name: 'Executive Demo User',
          email: 'ceo@aljeri.com',
          role: 'ceo',
          department: 'Executive Leadership',
          auth_method: 'palm_biometric_demo',
          tokens: {
            access_token: 'demo_access_token_' + Date.now(),
            refresh_token: 'demo_refresh_token_' + Date.now(),
            session_token: 'demo_session_token_' + Date.now(),
            expires_in: 86400,
          }
        };

        // Wait a moment to show success state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        onSuccess?.(demoUserData);
      } else {
        setScanResult('failed');
        console.log('❌ Palm authentication failed (demo mode)');
        onError?.(t('Palm not recognized. Please try again or use password login.'));
      }
    } catch (error) {
      console.error('❌ Palm scan error:', error);
      setScanResult('failed');
      onError?.(t('Palm scan failed. Please try again.'));
    } finally {
      setScanning(false);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setScanProgress(0);
    setCapturedImage(null);
  };

  return (
    <div>
      <Card
        style={{
          background: 'linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)',
          border: '1px solid #52c41a',
          borderRadius: '16px',
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
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
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
              {t('Palm Authentication Demo')}
            </Title>
            <Text type="secondary">
              {t('Advanced biometric security for executives')}
            </Text>
            <br />
            <Tag color="green" style={{ marginTop: '8px' }}>
              {t('Demo Mode - No HTTPS Required')}
            </Tag>
          </div>

          {/* Camera Section */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              position: 'relative', 
              display: 'inline-block',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid #52c41a',
              background: '#000',
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

              {/* Scanning Overlay */}
              {scanning && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(82, 196, 26, 0.1)',
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
                      border: '3px solid #52c41a',
                      borderRadius: '50%',
                      marginBottom: '16px',
                    }}
                  />
                  <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                    {t('Scanning Palm...')}
                  </Text>
                  <Progress 
                    percent={scanProgress} 
                    size="small" 
                    strokeColor="#52c41a"
                    style={{ width: '200px', marginTop: '8px' }}
                  />
                </div>
              )}

              {/* Result Overlay */}
              {scanResult && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: scanResult === 'success' 
                    ? 'rgba(82, 196, 26, 0.9)' 
                    : 'rgba(255, 77, 79, 0.9)',
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
            
            {/* Hidden canvas for image capture */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          {/* Control Buttons */}
          <Row gutter={8} justify="center">
            <Col>
              <Button
                type={cameraActive ? "default" : "primary"}
                icon={<CameraOutlined />}
                onClick={cameraActive ? stopCamera : startCamera}
                disabled={scanning}
              >
                {cameraActive ? t('Stop Camera') : t('Start Camera')}
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<ScanOutlined />}
                onClick={simulatePalmScan}
                disabled={!cameraActive || scanning}
                loading={scanning}
                style={{
                  background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                  border: 'none',
                }}
              >
                {scanning ? t('Scanning...') : t('Scan Palm')}
              </Button>
            </Col>
            {scanResult && (
              <Col>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={resetScan}
                >
                  {t('Try Again')}
                </Button>
              </Col>
            )}
          </Row>

          {/* Instructions */}
          <Alert
            message={t('Demo Instructions')}
            description={
              <div>
                <Paragraph style={{ margin: '8px 0', fontSize: '13px' }}>
                  1. {t('Click "Start Camera" to activate your webcam')}
                </Paragraph>
                <Paragraph style={{ margin: '8px 0', fontSize: '13px' }}>
                  2. {t('Position your palm in front of the camera')}
                </Paragraph>
                <Paragraph style={{ margin: '8px 0', fontSize: '13px' }}>
                  3. {t('Click "Scan Palm" to authenticate (80% demo success rate)')}
                </Paragraph>
                <Divider style={{ margin: '12px 0' }} />
                <Text style={{ fontSize: '12px', color: '#666' }}>
                  <SafetyOutlined style={{ marginRight: '4px' }} />
                  {t('Demo Mode: No actual biometric data is processed or stored')}
                </Text>
              </div>
            }
            type="info"
            showIcon
            style={{ textAlign: 'left' }}
          />

          {/* Demo Features */}
          <div style={{ textAlign: 'center' }}>
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => setShowInstructions(true)}
            >
              {t('View Demo Features')}
            </Button>
          </div>
        </Space>
      </Card>

      {/* Demo Features Modal */}
      <Modal
        title={
          <Space>
            <SafetyOutlined style={{ color: '#52c41a' }} />
            <span>{t('Palm Authentication Demo Features')}</span>
          </Space>
        }
        open={showInstructions}
        onCancel={() => setShowInstructions(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setShowInstructions(false)}>
            {t('Got It')}
          </Button>
        ]}
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          <Alert
            message={t('Executive Demo Experience')}
            description={t('This demo showcases palm biometric authentication for executive users without requiring complex setup or HTTPS certificates.')}
            type="success"
            showIcon
          />

          <div>
            <Title level={5}>{t('Demo Features')}</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" style={{ height: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <CameraOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <Text strong>{t('Live Camera Feed')}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {t('Real webcam integration with video preview')}
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ height: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <ScanOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                    <Text strong>{t('Palm Recognition')}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {t('Simulated palm scanning with visual feedback')}
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ height: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                    <Text strong>{t('Success Animation')}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {t('Beautiful success/failure feedback')}
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ height: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <UserOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
                    <Text strong>{t('Executive Login')}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {t('Complete login flow with user data')}
                    </Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>

          <div>
            <Title level={5}>{t('Technical Implementation')}</Title>
            <ul style={{ paddingLeft: '20px' }}>
              <li><Text style={{ fontSize: '13px' }}>{t('getUserMedia() API for camera access')}</Text></li>
              <li><Text style={{ fontSize: '13px' }}>{t('Canvas API for frame capture')}</Text></li>
              <li><Text style={{ fontSize: '13px' }}>{t('Local image processing (no cloud required)')}</Text></li>
              <li><Text style={{ fontSize: '13px' }}>{t('Simulated ML recognition algorithm')}</Text></li>
              <li><Text style={{ fontSize: '13px' }}>{t('Progressive scanning animation')}</Text></li>
              <li><Text style={{ fontSize: '13px' }}>{t('Complete authentication workflow')}</Text></li>
            </ul>
          </div>

          <div>
            <Title level={5}>{t('Production Upgrade Path')}</Title>
            <ul style={{ paddingLeft: '20px' }}>
              <li><Text style={{ fontSize: '13px' }}>{t('Replace demo logic with TensorFlow.js handpose detection')}</Text></li>
              <li><Text style={{ fontSize: '13px' }}>{t('Add palm vein pattern recognition')}</Text></li>
              <li><Text style={{ fontSize: '13px' }}>{t('Implement secure enrollment process')}</Text></li>
              <li><Text style={{ fontSize: '13px' }}>{t('Add liveness detection (anti-spoofing)')}</Text></li>
              <li><Text style={{ fontSize: '13px' }}>{t('Integrate with enterprise identity providers')}</Text></li>
            </ul>
          </div>

          <Alert
            message={t('Demo Benefits')}
            description={t('This demo works on any device with a camera, requires no special setup, and showcases the complete executive authentication experience.')}
            type="info"
            showIcon
          />
        </Space>
      </Modal>
    </div>
  );
};

export default PalmLoginDemo;
