import { mdiAccount, mdiBallotOutline, mdiGithub, mdiMail, mdiUpload } from '@mdi/js'
import { Field, Form, Formik } from 'formik'
import Head from 'next/head'
import { ReactElement, useState } from 'react'
import BaseButton from '../components/BaseButton'
import BaseButtons from '../components/BaseButtons'
import BaseDivider from '../components/BaseDivider'
import CardBox from '../components/CardBox'
import FormCheckRadio from '../components/FormCheckRadio'
import FormCheckRadioGroup from '../components/FormCheckRadioGroup'
import FormField from '../components/FormField'
import FormFilePicker from '../components/FormFilePicker'
import LayoutAuthenticated from '../layouts/Authenticated'
import SectionMain from '../components/SectionMain'
import SectionTitle from '../components/SectionTitle'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import { getPageTitle } from '../config'
import EditorBlock from '../components/EditorBlock'
import { OutputData } from '@editorjs/editorjs'
import EditorJsRenderer from '../components/EditorJsRenderer'

const FormsPage = () => {

  const [data, setData] = useState<OutputData>();

  return (
    <>
      <Head>
        <title>{getPageTitle('Forms')}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton icon={mdiBallotOutline} title="Medical Record" main>
        </SectionTitleLineWithButton>

        <CardBox>
        <div className='border'><EditorBlock data={data} onChange={setData} holder="editorjs-container" /></div>
      </CardBox>

      <SectionMain>
      <SectionTitleLineWithButton icon={mdiBallotOutline} title="Preview" main>
        </SectionTitleLineWithButton>
      <div className="p-16">{data && <EditorJsRenderer data={data} />}</div>
      </SectionMain>
      </SectionMain>
    </>
  )
}

FormsPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default FormsPage
