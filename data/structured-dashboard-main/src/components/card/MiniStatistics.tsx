// Custom components
import Card from 'components/card/Card';

export default function Default(props: {
	startContent?: JSX.Element;
	endContent?: JSX.Element;
	name: string;
	growth?: string | number;
	value: string | number;
}) {
	const { startContent, endContent, name, growth, value } = props;

	return (
		<Card className="py-4">
			<div className="flex items-center justify-center h-full">
				{startContent}

				<div className={`my-auto ${startContent ? 'ml-4' : 'ml-0'}`}>
					<div className="text-secondaryGray-600 text-sm leading-none">
						{name}
					</div>
					<div className="text-secondaryGray-900 text-2xl">
						{value}
					</div>
					{growth ? (
						<div className="flex items-center">
							<span className="text-green-500 text-xs font-bold mr-2">
								{growth}
							</span>
							<span className="text-secondaryGray-600 text-xs font-normal">
								since last month
							</span>
						</div>
					) : null}
				</div>
				<div className="ml-auto">
					{endContent}
				</div>
			</div>
		</Card>
	);
}