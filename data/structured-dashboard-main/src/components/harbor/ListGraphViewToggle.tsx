'use client';

import { Box, UseRadioProps, useRadio, useRadioGroup } from '@chakra-ui/react';

import { GiHamburgerMenu } from "react-icons/gi";
import { PiGraphDuotone } from 'react-icons/pi';
import React from 'react';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { LuPanelRight } from "react-icons/lu";
import { LuPanelBottom } from "react-icons/lu";

export function RadioCard(props: UseRadioProps & { icon: React.ElementType, left?: boolean, right?: boolean }) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const { icon: IconComponent } = props;

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" flex="1" maxWidth={'fit-content'} className='h-6'>
      {' '}
      {/* Updated to flex 1 for equal distribution */}
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderColor="gray.300"
        borderRadius="7px"
        // boxShadow="md"
        _checked={{
          bg: 'black',
          color: 'white',
          borderColor: 'black',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        p={2}
        textAlign="center"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width={'3rem'}
        className='h-[1.75rem]'
        paddingRight={props.left ? 2 : 3}
        paddingLeft={props.right ? 2 : 3}
        borderTopLeftRadius={props.left ? '7PX' : '0'}
        borderBottomLeftRadius={props.left ? '7PX' : '0'}
        borderTopRightRadius={props.right ? '7PX' : '0'}
        borderBottomRightRadius={props.right ? '7PX' : '0'}
      >
        <IconComponent className='' />
      </Box>
    </Box>
  );
}

// Toggle component
export const ListGraphViewToggle = () => {
  const { harborViewMode, setHarborViewMode } = useHarborStore();

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'viewMode',
    defaultValue: harborViewMode,
    onChange: setHarborViewMode,
  });

  const group = getRootProps();

  return (
    <Box
      {...group}
      display="flex"
      bg="offwhite.800"
      w={'auto'}
      mr={2}
      className='h-[1.75rem]'
    >
      <RadioCard {...getRadioProps({ value: 'list' })} icon={GiHamburgerMenu} left />
      <RadioCard {...getRadioProps({ value: 'graph' })} icon={PiGraphDuotone} right />
    </Box>
  );
};

export const ListGraphViewToggleSingleButton = () => {

  const { sourcesTableAndGraphViewSideBySide, setSourcesTableAndGraphViewSideBySide, setTypesTableAndGraphViewSideBySide, typesTableAndGraphViewSideBySide } = useHarborStore();

  return (
    <>
      <button className={`flex cursor-pointer items-center justify-center h-[1.75rem] w-8
      border rounded-md rounded-br-md ${sourcesTableAndGraphViewSideBySide ? 'bg-black border-black' : 'bg-white text-white border-gray-300'}
      `}
        onClick={() => {
          setSourcesTableAndGraphViewSideBySide(!sourcesTableAndGraphViewSideBySide);
          setTypesTableAndGraphViewSideBySide(!typesTableAndGraphViewSideBySide);
        }}
      >
        {/* <PiGraphDuotone className={`text-sm ${!sourcesTableAndGraphViewSideBySide ? 'text-black' : 'text-white'}`} /> */}
        {
          !sourcesTableAndGraphViewSideBySide ? <LuPanelRight className='text-black' /> : <LuPanelBottom className='text-white' />
        }
      </button>
    </>
  );
}