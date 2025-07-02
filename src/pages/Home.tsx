import { useGetBooksQuery } from "@/lib/api";


const Home = () => {
    const { data } = useGetBooksQuery();
    console.log(data)
  return (
    <div>Home</div>
  )
}

export default Home