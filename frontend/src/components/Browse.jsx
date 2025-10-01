import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import Footer from './shared/Footer';
import { sampleJobs } from '@/data/staticData';

const Browse = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);  // Assuming allJobs is an array
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(''));
        };
    }, [dispatch]);

    return (
        <>

            <div className="bg-gray-900 min-h-screen text-white bg-gradient-to-br from-[#00040A] to-[#001636]">
                <Navbar />
                <div className='max-w-7xl mx-auto pt-16'>
                    <h1 className='font-bold text-xl my-10'>
                        Search Results ({ allJobs.length })
                    </h1>
                    { searchedQuery === '' && allJobs.length === 0 ? (
                        <>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
                                {sampleJobs.map((job) => (
                                    <Job key={job._id} job={job} />
                                ))}
                            </div>
                            <div className="text-center mt-8">
                                <p className="text-gray-400 text-sm">
                                    Showing sample jobs. Sign up to see real opportunities!
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
                            { allJobs.length > 0 ? (
                                allJobs.map((job) => (
                                    <Job key={ job._id } job={ job } />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-lg text-gray-400 mb-4">No jobs found matching your search.</p>
                                    <p className="text-sm text-gray-500">Try adjusting your search criteria or browse all jobs.</p>
                                </div>
                            ) }
                        </div>
                    ) }
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Browse;
