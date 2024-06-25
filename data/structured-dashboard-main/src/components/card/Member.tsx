import React from 'react';
// Custom components
import Card from 'components/card/Card';
// Custom icons
import { IoEllipsisVertical } from 'react-icons/io5';

export default function Default(props: { avatar: string; name: string; job: string }) {
	const { avatar, name, job, ...rest } = props;

	return (
		<></>
	);
}