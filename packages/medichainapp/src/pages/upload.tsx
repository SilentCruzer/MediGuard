import { useState } from 'react'
import React, { ReactElement } from 'react'
import LayoutAuthenticated from '../layouts/Authenticated'
import lit from '../components/lit.js'
import CardBox from '../components/CardBox'
import FormField from '../components/FormField'
import { mdiAccount } from '@mdi/js'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import axios from 'axios'

const noAuthError =
  'The access control condition check failed! You should have at least 0 ETH to decrypt this file.'

function UploadRecord() {
  const [file, setFile] = useState(null)
  const [encryptedFile, setEncryptedFile] = useState(null)
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState(null)
  const [fileSize, setFileSize] = useState(0)
  const [url, setURL] = useState('')
  const [toDecrypt, setToDecrypt] = useState(null)
  const [address, setAddress] = useState('')

  const selectFile = (e) => {
    setFile(e.target.files[0])
    setEncryptedFile(null)
    setEncryptedSymmetricKey(null)
    setFileSize(0)

    encryptFile()
    sendFileToIPFS()
  }

  const setTarget = (e) => {
    setAddress(e.target.value)
  }

  const sendFileToIPFS = async () => {
    if (encryptFile) {
      try {
        const formData = new FormData()
        formData.append('file', encryptedFile)

        const urlIpfs = `https://api.pinata.cloud/pinning/pinFileToIPFS`

        const response = await axios
          .post(urlIpfs, formData, {
            headers: {
              'Content-Type': `multipart/form-data;boundary=${formData._boundary}}`,
              pinata_api_key: 'e1d4fbf71ed9d47027a5',
              pinata_secret_api_key:
                '837d0a40d0f5e7b3eed06a5fdd324a48d7a32a2dad9fe780b4d377c47a571f3a',
            },
          })
          .then(function (response) {
            const ImgHash = `https://ipfs.io/ipfs/${response.data.IpfsHash}`
            console.log(ImgHash)
          })
          .catch(function (error) {
            console.log(error)
          })
      } catch (error) {
        console.log('Error sending File to IPFS: ')
        console.log(error)
      }
    }
  }

  const encryptFile = async () => {
    if (file === null) {
      alert('Please select a file before encrypting!')
      return
    }

    const { encryptedFile, encryptedSymmetricKey } = await lit.encryptFile(file, address)
    setEncryptedFile(encryptedFile)
    setEncryptedSymmetricKey(encryptedSymmetricKey)
    setFileSize(0)
  }

  const decryptFile = async () => {
    if (encryptedFile === null) {
      alert('Please encrypt your file first!')
      return
    }

    // https://ipfs.io/ipfs/QmRw7b7ZW9vAjLjKkbMsYGmfDu8dZkVfjgvKxVQnR8ZCUz

    try {
      axios({
        url: url, //your url
        method: 'GET',
        responseType: 'blob', // important
      }).then((response) => {
        // create file link in browser's memory
        const href = response.data
        setToDecrypt(href)
      })
      const decrypted = await lit.decryptFile(encryptedFile, encryptedSymmetricKey, address)
      const blob = new Blob([decrypted])
      const urldown = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = urldown
      link.download = 'decrypted_file.txt' // set the desired file name
      document.body.appendChild(link)
      link.click()
      setFileSize(decrypted.byteLength)
    } catch (error) {
      console.log(error)
      alert('You are not authorized to access')
    }
  }

  return (
    <div className="UploadRecord p-10">
      <SectionTitleLineWithButton
        icon={mdiAccount}
        title="Upload Records"
        main
      ></SectionTitleLineWithButton>
      <CardBox className="mb-6">
        <div></div>
        <FormField label="Give access to" help="Max 500kb">
          <input type="text" onChange={setTarget} />
        </FormField>
        <FormField label="Choose Files" help="Max 500kb">
          <input type="file" name="file" onChange={selectFile} />
        </FormField>
      </CardBox>
      <div>
        <button onClick={encryptFile}>Encrypt</button>
        <button onClick={decryptFile}>Decrypt</button>
      </div>
      {encryptedFile !== null && fileSize === 0 && (
        <h3>File Encrypted: {file.name}. and uploaded successfully</h3>
      )}
      {fileSize > 0 && (
        <h3>
          File Decrypted: {file.name} of {fileSize} bytes
        </h3>
      )}
    </div>
  )
}

UploadRecord.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default UploadRecord
