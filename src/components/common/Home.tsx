import { useSelector } from "react-redux"
import Layout from "./Layout"


const Home = () => {
    const state = useSelector(state => state)
  return (
    <>
      <Layout title="ALBOOK" subTitle="Home">{JSON.stringify(state)}</Layout>
    </>
    
  )
}

export default Home