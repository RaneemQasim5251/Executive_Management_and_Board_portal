import { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ReloadOutlined } from '@ant-design/icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryBase extends Component<Props & WithTranslation, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const { t } = this.props;
      return (
        <Result
          status="error"
          title={t('Something went wrong')}
          subTitle={t('An unexpected error occurred. Please try refreshing the page.')}
          extra={[
            <Button 
              type="primary" 
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
              key="reload"
            >
              {t('Reload Page')}
            </Button>
          ]}
        />
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryBase);