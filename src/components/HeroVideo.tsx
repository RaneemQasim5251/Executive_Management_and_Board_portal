import React, { useRef, useEffect } from "react";

type HeroVideoProps = {
	src?: string;
	className?: string;
	borderRadius?: number;
	fillParent?: boolean; // fill the entire parent without enforcing square
	playOnce?: boolean; // play the video once, do not loop
};

const HeroVideo: React.FC<HeroVideoProps> = ({
	src = "/AljeriVedAi.mp4",
	className,
	borderRadius = 16,
	fillParent = false,
	playOnce = true,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const v = videoRef.current;
		if (!v) return;
		const tryPlay = async () => {
			try {
				await v.play();
			} catch {
				// ignore autoplay restrictions
			}
		};
		tryPlay();
	}, []);

	return (
		<div
			className={className}
			style={{
				position: fillParent ? "absolute" : "relative",
				inset: fillParent ? 0 : undefined,
				width: "100%",
				height: fillParent ? "100%" : undefined,
				aspectRatio: fillParent ? undefined : "1 / 1",
				borderRadius: fillParent ? undefined : borderRadius,
				overflow: "hidden",
				boxShadow: fillParent ? undefined : "0 6px 18px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
				background: "transparent",
			}}
			dir="auto"
		>
			<video
				ref={videoRef}
				src={src}
				muted
				loop={!playOnce}
				playsInline
				autoPlay
				preload="metadata"
				onEnded={() => {
					const v = videoRef.current;
					if (v && playOnce) {
						v.pause();
					}
				}}
				aria-hidden
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
					display: "block",
					pointerEvents: "none",
				}}
			/>
			{/* Frosted glass overlay to ensure readability */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background: "rgba(255,255,255,0.14)",
					backdropFilter: "blur(4px)",
					WebkitBackdropFilter: "blur(4px)",
					border: "1px solid rgba(255,255,255,0.25)",
					pointerEvents: "none",
				}}
			/>
		</div>
	);
};

export default HeroVideo;


