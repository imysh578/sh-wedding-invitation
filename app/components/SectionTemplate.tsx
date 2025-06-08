import React from "react";

interface SectionTemplateProps {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	children: React.ReactNode;
	id?: string;
}

export default function SectionTemplate({ title, subtitle, children, id }: SectionTemplateProps) {
	return (
		<section id={id} className="bg-white py-12 px-4 relative overflow-hidden">
			<div className="max-w-xl mx-auto text-center">
				{subtitle && <div className="uppercase text-gray-400 tracking-widest text-sm mb-2">{subtitle}</div>}
				<h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6">{title}</h2>
				<div>{children}</div>
			</div>
		</section>
	);
}
