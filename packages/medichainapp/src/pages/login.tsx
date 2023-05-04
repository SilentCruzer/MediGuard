import React from 'react'
import type { ReactElement } from 'react'
import Head from 'next/head'
import BaseButton from '../components/BaseButton'
import CardBox from '../components/CardBox'
import SectionFullScreen from '../components/SectionFullScreen'
import LayoutGuest from '../layouts/Guest'
import { Field, Form, Formik } from 'formik'
import FormField from '../components/FormField'
import FormCheckRadio from '../components/FormCheckRadio'
import BaseDivider from '../components/BaseDivider'
import BaseButtons from '../components/BaseButtons'
import { useRouter } from 'next/router'
import { getPageTitle } from '../config'
import dynamic from "next/dynamic";
import { Suspense } from "react";

const SocialLoginDynamic = dynamic(
  () => import("../components/scw").then((res) => res.default),
  {
    ssr: false,
  }
);

export default function Error() {
  
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SocialLoginDynamic />
      </Suspense>
    </div>
  );
}

Error.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>
}
