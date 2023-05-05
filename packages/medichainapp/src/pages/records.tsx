import { mdiGithub, mdiMonitorCellphone, mdiTableBorder, mdiTableOff } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import BaseButton from '../components/BaseButton'
import CardBox from '../components/CardBox'
import CardBoxComponentEmpty from '../components/CardBoxComponentEmpty'
import LayoutAuthenticated from '../layouts/Authenticated'
import NotificationBar from '../components/NotificationBar'
import SectionMain from '../components/SectionMain'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import TableSampleClients from '../components/TableSampleClients'
import { getPageTitle } from '../config'

const TablesPage = () => {
  return (
    <>
      <Head>
        <title>{getPageTitle('Tables')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiTableBorder} title="Tables" main>
        </SectionTitleLineWithButton>

        <CardBox className="mb-6" hasTable>
          <TableSampleClients />
        </CardBox>
      </SectionMain>
    </>
  )
}

TablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default TablesPage
