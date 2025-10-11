import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import apiClient from '@/utils/axiosConfig';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { motion } from 'framer-motion';
import Footer from '../shared/Footer';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector((store) => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await apiClient.get(`/application/${params.id}/applicants`);
                dispatch(setAllApplicants({ applications: res.data.applications, pagination: res.data.pagination }));
            } catch (error) {

            }
        };
        fetchAllApplicants();
    }, []);

    return (
        <div>
            <Navbar />
            <motion.div
                className="max-w-7xl mx-auto"
                initial={ { opacity: 0, y: 20 } }
                animate={ { opacity: 1, y: 0 } }
                transition={ { duration: 0.6 } }
            >
                <h1 className="font-bold text-2xl my-5 text-blue-600">
                    Applicants ({ applicants?.applications?.length })
                </h1>
                <ApplicantsTable />
            </motion.div>
            <Footer />
        </div>
    );
};

export default Applicants;
