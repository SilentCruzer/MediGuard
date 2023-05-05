import { useState } from 'react'
import React, { ReactElement } from 'react'
import LayoutAuthenticated from '../layouts/Authenticated'
import lit from '../components/lit.js'
import CardBox from '../components/CardBox'
import FormField from '../components/FormField'
import { mdiAccount } from '@mdi/js'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import axios from 'axios'
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';

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


  const selectFile = async (e) => {
    setFile(e.target.files[0])
    setEncryptedFile(null)
    setEncryptedSymmetricKey(null)
    setFileSize(0)

    await encryptFile()
    await sendFileToIPFS()
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
            setURL(ImgHash);
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

  const updateContract = async () => {
    if(typeof window !== undefined){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = '0x134b91f7B5c25259B6151a4E68F6679c68A6B217';
    const contractInstance = new ethers.Contract(contractAddress, ContractAbi, provider);
    console.log("sdasd")
    console.log(url)
    if(url != ""){
      console.log("sdasd")

      try {
      const signer = provider.getSigner();
      const transaction = await contractInstance.connect(signer).addFile(url, encryptedSymmetricKey, address, signer._address);
      console.log(transaction);
    } catch (error) {
      console.error(error);
    }
    console.log(url, encryptedSymmetricKey)
    }
    }
    
  }

  const decryptFile = async () => {
    if (encryptedFile === null) {
      alert('Please encrypt your file first!')
      return
    }

    // https://ipfs.io/ipfs/QmRw7b7ZW9vAjLjKkbMsYGmfDu8dZkVfjgvKxVQnR8ZCUz

    try {
      const decrypted = await lit.decryptFile(encryptedFile, encryptedSymmetricKey, address)
      const blob = new Blob([decrypted])
      const urldown = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = urldown
      link.download = 'decrypted_file.txt' // set the desired file name
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.log(error)
      alert('You are not authorized to access')
    }
  }

  const downloadFile = () => {
    const url = window.URL.createObjectURL(encryptedFile);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'encrypted_file.txt');
    document.body.appendChild(link);
    link.click();
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
        <FormField label="Give access to" >
          <input type="text" onChange={setTarget} />
        </FormField>
        <FormField label="Choose Files" help="Max 500kb">
          <input type="file" name="file" onChange={selectFile} />
        </FormField>
      </CardBox>
      <div>
        <button onClick={updateContract} className="px-5 py-2 border">Encrypt</button>
      </div>
      {encryptedFile !== null && fileSize === 0 && (
        <div>
          <h3>File Encrypted: {file.name}. and uploaded successfully</h3>
          <h3>Symetric key: {encryptedSymmetricKey}</h3>
          <button onClick={downloadFile}>Download encrypted file</button>
        </div>
        
      )}
    </div>
  )
}

UploadRecord.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export const ContractAbi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_symmetricKey",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_authorizedAddress",
				"type": "address"
			}
		],
		"name": "addFile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_fileId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_symmetricKey",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_authorizedAddress",
				"type": "address"
			}
		],
		"name": "updateFile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_fileId",
				"type": "uint256"
			}
		],
		"name": "getFile",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUserFiles",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export default UploadRecord
