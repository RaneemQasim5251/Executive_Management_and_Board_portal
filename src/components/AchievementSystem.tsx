import { FC, useState } from 'react';
import { 
  Badge, 
  Card, 
  Progress, 
  Typography, 
  Space, 

  Modal,
  Row,
  Col,
  Tag,
  Button,
  notification
} from 'antd';
import {
  TrophyOutlined,

  StarOutlined,
  RocketOutlined,
  CrownOutlined,
  ThunderboltOutlined,

  HeartOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'productivity' | 'leadership' | 'innovation' | 'collaboration';
  progress: number;
  maxProgress: number;
  completed: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward: {
    points: number;
    badge?: string;
  };
}

interface AchievementSystemProps {
  visible: boolean;
  onClose: () => void;
}

// Achievement data with translation keys
const getAchievements = (t: any): Achievement[] => [
  {
    id: '1',
    title: t('Revenue Master'),
    description: t('Achieve 100% of quarterly revenue target'),
    icon: <TrophyOutlined />,
    category: 'productivity',
    progress: 8,
    maxProgress: 10,
    completed: false,
    rarity: 'epic',
    reward: { points: 1000, badge: t('Revenue King') }
  },
  {
    id: '2',
    title: t('Team Builder'),
    description: t('Successfully onboard 5 new team members'),
    icon: <HeartOutlined />,
    category: 'leadership',
    progress: 5,
    maxProgress: 5,
    completed: true,
    rarity: 'rare',
    reward: { points: 500, badge: t('People Leader') }
  },
  {
    id: '3',
    title: t('Innovation Champion'),
    description: t('Launch 3 successful innovation projects'),
    icon: <RocketOutlined />,
    category: 'innovation',
    progress: 2,
    maxProgress: 3,
    completed: false,
    rarity: 'legendary',
    reward: { points: 2000, badge: t('Innovation Legend') }
  },
  {
    id: '4',
    title: t('Meeting Master'),
    description: t('Conduct 50 productive meetings'),
    icon: <StarOutlined />,
    category: 'collaboration',
    progress: 47,
    maxProgress: 50,
    completed: false,
    rarity: 'common',
    reward: { points: 250 }
  },
  {
    id: '5',
    title: t('Efficiency Expert'),
    description: t('Maintain 95%+ team efficiency for 3 months'),
    icon: <ThunderboltOutlined />,
    category: 'productivity',
    progress: 2,
    maxProgress: 3,
    completed: false,
    rarity: 'epic',
    reward: { points: 1500, badge: t('Efficiency Master') }
  },
  {
    id: '6',
    title: t('Strategic Visionary'),
    description: t('Complete strategic planning for next 5 years'),
    icon: <CrownOutlined />,
    category: 'leadership',
    progress: 1,
    maxProgress: 1,
    completed: true,
    rarity: 'legendary',
    reward: { points: 3000, badge: t('Strategic Legend') }
  }
];

export const AchievementSystem: FC<AchievementSystemProps> = ({ visible, onClose }) => {
  const { t, i18n } = useTranslation();
  const achievements = getAchievements(t);
  const [userAchievements] = useState<Achievement[]>(achievements);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newAchievement] = useState<Achievement | null>(null);
  const [, contextHolder] = notification.useNotification();
  const isArabic = i18n.language === 'ar';

  // Arabic display mappings for titles, descriptions, categories, and rarity
  const arTitles: Record<string, string> = {
    'Revenue Master': 'سيد الإيرادات',
    'Team Builder': 'باني الفريق',
    'Innovation Champion': 'بطل الابتكار',
    'Meeting Master': 'سيد الاجتماعات',
    'Efficiency Expert': 'خبير الكفاءة',
    'Strategic Visionary': 'صاحب الرؤية الاستراتيجية'
  };

  const arDescriptions: Record<string, string> = {
    'Achieve 100% of quarterly revenue target': 'تحقيق 100% من هدف الإيرادات الربعي',
    'Successfully onboard 5 new team members': 'نجاح في ضم 5 أعضاء جدد للفريق',
    'Launch 3 successful innovation projects': 'إطلاق 3 مشاريع ابتكار ناجحة',
    'Conduct 50 productive meetings': 'عقد 50 اجتماعاً مثمراً',
    'Maintain 95%+ team efficiency for 3 months': 'الحفاظ على كفاءة الفريق بنسبة 95%+ لمدة 3 أشهر',
    'Complete strategic planning for next 5 years': 'إكمال التخطيط الاستراتيجي للخمس سنوات القادمة'
  };

  const arCategory: Record<Achievement['category'], string> = {
    productivity: 'الإنتاجية',
    leadership: 'القيادة',
    innovation: 'الابتكار',
    collaboration: 'التعاون'
  };

  const arRarity: Record<Achievement['rarity'], string> = {
    common: 'شائع',
    rare: 'نادر',
    epic: 'ملحمي',
    legendary: 'أسطوري'
  };

  // Removed auto-simulation for cleaner executive experience
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (Math.random() > 0.95) {
  //       simulateProgress();
  //     }
  //   }, 30000);
  //   return () => clearInterval(interval);
  // }, []);

  // simulateProgress function removed as it was unused

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return '#10B981';
      case 'rare': return '#06B6D4';
      case 'epic': return '#0C085C';
      case 'legendary': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'productivity': return <ThunderboltOutlined />;
      case 'leadership': return <CrownOutlined />;
      case 'innovation': return <RocketOutlined />;
      case 'collaboration': return <HeartOutlined />;
      default: return <StarOutlined />;
    }
  };

  const totalPoints = userAchievements
    .filter(a => a.completed)
    .reduce((sum, a) => sum + a.reward.points, 0);

  const completedCount = userAchievements.filter(a => a.completed).length;
  const completionRate = Math.round((completedCount / userAchievements.length) * 100);

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <Space>
            <TrophyOutlined style={{ color: '#F59E0B' }} />
            <span>{i18n.language === 'ar' ? 'إنجازاتك' : t('Your Achievements')}</span>
            <Badge count={completedCount} style={{ backgroundColor: '#0C085C' }} />
          </Space>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
        styles={{
          body: { padding: '24px 0' }
        }}
      >
        {/* Progress Summary */}
        <div style={{ 
          background: '#0C085C',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          color: 'white',
          direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
          textAlign: i18n.language === 'ar' ? 'right' : 'left'
        }}>
          <div style={{ marginBottom: '12px', textAlign: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.95)', fontSize: '14px', fontWeight: 600 }}>
              {isArabic 
                ? 'نشكركم على جهودكم لقد أنجزتم ما يلي:' 
                : 'Thank you for your efforts. You have accomplished the following:'}
            </Text>
          </div>
          <Row gutter={[24, 24]} align="middle">
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalPoints}</div>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {isArabic ? 'الأهداف' : 'Achivements'}
                </Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{completedCount}</div>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {isArabic ? 'مكتمل' : 'Completed'}
                </Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <Progress
                  type="circle"
                  percent={completionRate}
                  size={60}
                  strokeColor="#10B981"
                  trailColor="rgba(255,255,255,0.2)"
                  format={(p) => <span style={{ color: 'white', fontWeight: 700 }}>{p}%</span>}
                />
                <br />
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                  {isArabic ? 'التقدم' : 'Progress'}
                </Text>
              </div>
            </Col>
          </Row>
        </div>

        {/* Achievements Grid */}
        <Row gutter={[24, 24]}>
          {userAchievements.map((achievement, index) => (
            <Col span={12} key={achievement.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  size="small"
                  style={{
                    borderRadius: '12px',
                    border: `2px solid ${getRarityColor(achievement.rarity)}30`,
                    backgroundColor: achievement.completed ? `${getRarityColor(achievement.rarity)}05` : 'white',
                    opacity: achievement.completed ? 1 : 0.8,
                    transition: 'all 0.3s ease',
                  }}
                  hoverable
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: getRarityColor(achievement.rarity),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px'
                    }}>
                      {achievement.completed ? <TrophyOutlined /> : achievement.icon}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Text strong style={{ fontSize: '14px' }}>
                          {isArabic ? (arTitles[achievement.title] || achievement.title) : achievement.title}
                        </Text>
                        <Tag color={getRarityColor(achievement.rarity)}>
                          {isArabic ? arRarity[achievement.rarity] : achievement.rarity}
                        </Tag>
                        {achievement.completed && (
                          <Badge dot style={{ backgroundColor: '#10B981' }} />
                        )}
                      </div>
                      
                      <Text style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '8px' }}>
                        {isArabic ? (arDescriptions[achievement.description] || achievement.description) : achievement.description}
                      </Text>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Progress 
                          percent={(achievement.progress / achievement.maxProgress) * 100}
                          size="small"
                          strokeColor="#10B981"
                          trailColor="#f0f0f0"
                          showInfo={false}
                          style={{ flex: 1 }}
                        />
                        <Text style={{ fontSize: '11px', color: '#9CA3AF' }}>
                          {achievement.progress}/{achievement.maxProgress}
                        </Text>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <Space size="small" style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
                          {getCategoryIcon(achievement.category)}
                          <Text style={{ fontSize: '11px', color: '#6B7280' }}>
                            {isArabic ? arCategory[achievement.category] : achievement.category}
                          </Text>
                        </Space>
                        <Text style={{ fontSize: '11px', fontWeight: 'bold', color: getRarityColor(achievement.rarity) }}>
                          +{achievement.reward.points} {isArabic ? 'نقطة' : 'pts'}
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Modal>

      {/* Achievement Celebration Modal */}
      <Modal
        open={showCelebration}
        onCancel={() => setShowCelebration(false)}
        footer={
          <Button 
            type="primary" 
            onClick={() => setShowCelebration(false)}
            style={{
                              background: '#0C085C',
              border: 'none',
              borderRadius: '8px'
            }}
          
          >
            Awesome! 🎉
          </Button>
        }
        centered
        width={400}
      >
        {newAchievement && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: 'center', padding: '20px' }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              style={{ fontSize: '64px', marginBottom: '16px' }}
            >
              🏆
            </motion.div>
            
            <Title level={3} style={{ color: '#0C085C', marginBottom: '8px' }}>
              Achievement Unlocked!
            </Title>
            
            <Title level={4} style={{ marginBottom: '8px' }}>
              {newAchievement.title}
            </Title>
            
            <Text style={{ color: '#6B7280', display: 'block', marginBottom: '16px' }}>
              {newAchievement.description}
            </Text>
            
            <div style={{
              background: 'rgba(12, 8, 92, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              border: `2px solid ${getRarityColor(newAchievement.rarity)}30`
            }}>
              <Space direction="vertical" align="center" size="small">
                <Text strong style={{ color: getRarityColor(newAchievement.rarity) }}>
                  +{newAchievement.reward.points} Points Earned!
                </Text>
                {newAchievement.reward.badge && (
                  <Tag color={getRarityColor(newAchievement.rarity)}>
                    🏅 {newAchievement.reward.badge}
                  </Tag>
                )}
              </Space>
            </div>
          </motion.div>
        )}
      </Modal>
    </>
  );
};