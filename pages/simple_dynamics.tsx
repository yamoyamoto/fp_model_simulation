import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import SimpleDynamics from '../src/components/organisms/SimpleDynamics'
import Link from 'next/link'

const SimpleDynamicsPage: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>FP Model Simulation</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          FP Modelと連想記憶のシュミレーション
        </h1>
        <SimpleDynamics />
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default SimpleDynamicsPage
