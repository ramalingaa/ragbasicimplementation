export default function IconBox(props: { icon: JSX.Element | string; [x: string]: any }) {
	const { icon, ...rest } = props;

	return (
		<div className='flex items-center content-center rounded-[50%]' {...rest}>
			{icon}
		</div>
	);
}
