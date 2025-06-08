import React from "react";

interface SectionTemplateProps {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	children: React.ReactNode;
	id?: string;
	backgroundColor?: string;
}

export default function SectionTemplate({
	title,
	subtitle,
	children,
	id,
	backgroundColor = "#ffffff",
}: SectionTemplateProps) {
	return (
		<section id={id} className="py-12 px-4 relative overflow-hidden" style={{ backgroundColor }}>
			<div className="max-w-xl mx-auto text-center">
				{subtitle && <div className="uppercase text-gray-400 tracking-widest text-sm mb-2">{subtitle}</div>}
				<h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6">{title}</h2>
				<div>{children}</div>
			</div>
		</section>
	);
}
