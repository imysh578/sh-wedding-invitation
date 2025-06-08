import React from "react";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
	ariaLabel?: string;
}

export default function Modal({ open, onClose, children, className = "", ariaLabel }: ModalProps) {
	if (!open) return null;
	return (
		<div
			className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
			onClick={onClose}
			aria-label={ariaLabel}
			role="dialog"
			aria-modal="true"
		>
			<div
				className={`bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative ${className}`}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
}
