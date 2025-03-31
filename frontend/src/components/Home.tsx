import DataTable from './DataTable';

const Home = () => {
    return (
        <div>
            <hr className="mt-8 "/>
            <h1 className="mt-8 mb-8 text-orange-400 text-4xl font-bold text-center">Home page</h1>
            <DataTable />
            <hr/>
        </div>
    );
};

export default Home;