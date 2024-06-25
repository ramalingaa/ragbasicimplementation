import { useState } from 'react';
import {
  SiAmazons3,
  SiGooglesheets,
  SiHubspot,
  SiSalesforce,
} from 'react-icons/si';
import { BiLogoPostgresql } from "react-icons/bi";
import { TbBrandGoogleBigQuery } from "react-icons/tb";

import AmazonS3ConnectionModal from './AmazonS3ConnectionModal';
import { FaPlus } from 'react-icons/fa';
import HarborCustomModal from './HarborCustomModal';
import HubSpotConnectionModal from './HubSpotConnectionModal';
import SalesForceConnectionModal from './SalesForceConnectionModal';
import PostgresConnectionModal from './PostgresConnectionModal';
import BigQueryConnectionModal from './BigQueryConnectionModal';
import useDisclosure from 'hooks/useDisclosure';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import SnowflakeConnectionCustomModal from './SnowflakeConnectionModal';
import { FaRegSnowflake } from "react-icons/fa";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ConnectDataSource() {

  const availableIntegrationsArr = [
    {
      integrationName: 'Spreadsheet',
      icon: SiGooglesheets,
      urlPath: '/links/fileUpload',
      color: '#34A853',
      comingSoon: false,
    },
    {
      integrationName: 'Salesforce',
      icon: SiSalesforce,
      urlPath: '/links/salesforceConnection',
      color: '#00A1E0',
      comingSoon: false,
    },
    {
      integrationName: 'Hubspot',
      icon: SiHubspot,
      urlPath: '/links/hubspot',
      color: '#FF7A59',
      comingSoon: false,
    },
    {
      integrationName: 'Amazon S3',
      icon: SiAmazons3,
      urlPath: '/links/amazonS3',
      color: '#FF7A59',
      comingSoon: false,
    },
    {
      integrationName: 'Postgresql',
      icon: BiLogoPostgresql,
      urlPath: '/links/postgresql',
      color: '#0064a5',
      comingSoon: false,
    },
    {
      integrationName: 'Big Query',
      icon: TbBrandGoogleBigQuery,
      urlPath: '/links/bigQuery',
      color: '#0064a5',
      comingSoon: false,
    },
    {
      integrationName: 'Snowflake',
      icon: FaRegSnowflake,
      urlPath: '/links/snowflake',
      color: '#0064a5',
      comingSoon: false,
    },
  ];

  const {
    isOpen: isHarborModalOpen,
    onOpen: onHarborModalOpen,
    onClose: onHarborModalClose,
  } = useDisclosure();
  const {
    isOpen: isSalesforceModalOpen,
    onOpen: onSalesforceModalOpen,
    onClose: onSalesforceModalClose,
  } = useDisclosure();
  const {
    isOpen: isHubSpotModalOpen,
    onOpen: onHubSpotModalOpen,
    onClose: onHubSpotModalClose,
  } = useDisclosure();
  const {
    isOpen: isAmazonS3ModalOpen,
    onOpen: onAmazonS3ModalOpen,
    onClose: onAmazonS3ModalClose,
  } = useDisclosure();
  const {
    isOpen: postgresConnectionModalOpen,
    onOpen: postgresConnectionModalOnOpen,
    onClose: postgresConnectionModalClose,
  } = useDisclosure();
  const {
    isOpen: bigQueryModalOpen,
    onOpen: bigQueryModalOnOpen,
    onClose: bigQueryModalClose,
  } = useDisclosure();
  const {
    isOpen: isSnowflakeModalOpen,
    onOpen: onSnowflakeModalOpen,
    onClose: onSnowflakeModalClose,
  } = useDisclosure();

  const [selectedIntegration, setSelectedIntegration] = useState(null);

  return (
    <>
      <div
        className="w-auto h-[1.75rem] flex-col items-center content-center"
      >
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-medium shadow-sm hover:bg-[#2064e4] border border-blue-500 h-[1.75rem]">
              <FaPlus size={'0.75rem'} className='font-medium' /> New
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {availableIntegrationsArr.map((integration, index) => (
                  <div className="" key={index}>
                    <Menu.Item
                      key={index}
                    >
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm'
                          )}
                          onClick={() => {
                            setSelectedIntegration(integration);
                            if (integration.integrationName === 'Spreadsheet') {
                              onHarborModalOpen();
                            } else if (integration.integrationName === 'Salesforce') {
                              onSalesforceModalOpen();
                            } else if (integration.integrationName === 'Hubspot') {
                              onHubSpotModalOpen();
                            } else if (integration.integrationName === 'Amazon S3') {
                              onAmazonS3ModalOpen();
                            } else if (integration.integrationName === 'Postgresql') {
                              postgresConnectionModalOnOpen();
                            } else if (integration.integrationName === 'Big Query') {
                              bigQueryModalOnOpen();
                            } else if (integration.integrationName === 'Snowflake') {
                              onSnowflakeModalOpen();
                            }
                          }}
                        >
                          <integration.icon
                            style={{
                              color: integration.color,
                            }}
                            className={`mr-3 h-5 w-5 ${integration.color}`} aria-hidden="true" />
                          {integration.integrationName}
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {isHarborModalOpen && <HarborCustomModal
        isOpen={isHarborModalOpen}
        onClose={onHarborModalClose}
      />}
      {isSalesforceModalOpen && <SalesForceConnectionModal
        isOpen={isSalesforceModalOpen}
        onClose={onSalesforceModalClose}
      />}
      {isHubSpotModalOpen && <HubSpotConnectionModal
        isOpen={isHubSpotModalOpen}
        onClose={onHubSpotModalClose}
      />}
      {isAmazonS3ModalOpen && <AmazonS3ConnectionModal
        isOpen={isAmazonS3ModalOpen}
        onClose={onAmazonS3ModalClose}
      />}
      {postgresConnectionModalOpen && <PostgresConnectionModal
        isOpen={postgresConnectionModalOpen}
        onClose={postgresConnectionModalClose}
      />}
      {bigQueryModalOpen && <BigQueryConnectionModal
        isOpen={bigQueryModalOpen}
        onClose={bigQueryModalClose}
      />
      }
      {isSnowflakeModalOpen && <SnowflakeConnectionCustomModal
        isOpen={isSnowflakeModalOpen}
        onClose={onSnowflakeModalClose}
      />}
    </>
  );
}
