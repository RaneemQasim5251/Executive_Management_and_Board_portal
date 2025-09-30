import React, { useEffect } from 'react';

type WelcomeOverlayProps = {
	FullName: string; // Arabic preferred
	Title: string;
	onContinue: () => void;
	autoDismissMs?: number; // if provided, also auto-redirect after this period
};

export const renderWelcome = ({ FullName, Title }: { FullName: string; Title: string; }) => {
	const politeTitle = Title && Title.trim().length > 0 ? Title : 'الأستاذ';
	return {
		heading: `أهلًا وسهلًا بالـ ${politeTitle} ${FullName}`,
		sub: 'يسرّنا حضوركم. نورتم منصتكم، وكل ما فيها مُهيأ لخدمتكم.',
		cta: 'الانتقال إلى الصفحة الرئيسة',
	};
};

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ FullName, Title, onContinue, autoDismissMs }) => {
	const tpl = renderWelcome({ FullName, Title });

	useEffect(() => {
		if (typeof autoDismissMs === 'number' && autoDismissMs > 0) {
			const t = setTimeout(() => onContinue(), autoDismissMs);
			return () => clearTimeout(t);
		}
		return;
	}, [onContinue, autoDismissMs]);

	return (
		<div
			role="dialog"
			aria-modal="true"
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: 'rgba(12, 8, 92, 0.66)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				direction: 'rtl',
				zIndex: 9999,
			}}
		>
			<div
				style={{
					width: 'min(92vw, 560px)',
					borderRadius: 24,
					padding: '28px 24px',
					background: 'rgba(255,255,255,0.8)',
					backdropFilter: 'blur(8px)',
					WebkitBackdropFilter: 'blur(8px)',
					boxShadow: '0 18px 50px rgba(0,0,0,0.18)',
					textAlign: 'center',
				}}
			>
				<h1 style={{ margin: '0 0 10px', color: '#0C085C', fontWeight: 800, fontSize: 24 }}>{tpl.heading}</h1>
				<p style={{ margin: '0 0 18px', color: '#1f2937', fontSize: 16 }}>{tpl.sub}</p>
				<button
					aria-label="الانتقال إلى الصفحة الرئيسة"
					onClick={onContinue}
					style={{
						padding: '12px 18px',
						borderRadius: 12,
						border: 'none',
						background: '#0C085C',
						color: '#fff',
						fontWeight: 700,
						cursor: 'pointer',
					}}
				>
					{tpl.cta}
				</button>
			</div>
		</div>
	);
};

export default WelcomeOverlay;


