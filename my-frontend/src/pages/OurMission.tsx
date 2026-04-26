import React from 'react'
import Container from "../components/container";
import HeroS from "../../src/components/Mission/Heros"
import FooterS from "../components/Mission/Footer";
import IntroS from "../../src/components/Mission/Intros"
import { NavbarH } from '../components/Home/Navbarhome';



export const Services: React.FC =()=>{
    return(
        <>
        <Container className='bg-gradient-to-br from-green-100 via-emarald-50 to-teal-50 flex flex-col'>
            <NavbarH />
            <IntroS/>
            <HeroS/>
            <FooterS/>
        </Container>
        </>
    );
};

