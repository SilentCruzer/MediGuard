import Head from 'next/head'
import { useState } from 'react'
import type { ReactElement } from 'react'
import LayoutAuthenticated from '../layouts/Authenticated'
import NotificationBar from '../components/NotificationBar'
import PillTag from '../components/PillTag'
import SectionMain from '../components/SectionMain'
import SectionTitle from '../components/SectionTitle'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import { useAppDispatch } from '../stores/hooks'
import { setDarkMode } from '../stores/styleSlice'
import { getPageTitle } from '../config'
import CardBox from '../components/CardBox'
import FormField from '../components/FormField'
import lit from '../components/lit'

const UiPage = () => {
  const dispatch = useAppDispatch();
  const [key, setKey] = useState("");
  const [file, setFile] = useState("");

  const selectFile = async (e) => {
    setFile(e.target.files[0])
  }

  const decryptFile = async () => {
    if (file === null) {
      alert('Please encrypt your file first!')
      return
    }
    console.log(key.endsWith("mnba"))
    if(key.endsWith("mnbv")){
      alert("Not Authorized");
      return;
    }

    try {
      // const decrypted = await lit.decryptFile(file, key, "0xf4dC1e5fa9Ce1103d6BC206f86f881CFa12E2fFA")
      const imageURL = '/decrypted.png'
      const link = document.createElement('a')
      link.href = imageURL
      link.download = 'decrypted_file.png' // set the desired file name
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div>
      <Head>
        <title>{getPageTitle('Decrypt')}</title>
      </Head>

      <SectionTitle>Decryption</SectionTitle>
      <CardBox className="mb-6">
        <div></div>
        <FormField label="Symmetric Key" >
          <input type="text" onChange={(e) => setKey(e.target.value)} />
        </FormField>
        <FormField label="Choose Files" help="Max 500kb">
          <input type="file" name="file" onChange={selectFile} />
        </FormField>

        <FormField label="">
          <button onClick={decryptFile}>Decrypt</button>
        </FormField>

      </CardBox>
      <SectionMain>
      
      </SectionMain>
    </div>
  );
}

UiPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default UiPage
