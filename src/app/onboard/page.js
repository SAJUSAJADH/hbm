import { fetchUserInfo } from '@/actions/server';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'
import Onboard from '../../components/onboard'
import { CheckAccuntStats } from '../../actions/server';


async function OnboardPage() {

  const user = await currentUser();
  

  const profileInfo = await fetchUserInfo(user?.id);
  const stats = await CheckAccuntStats(user?.id)

  if (stats == false) {
      redirect('/suspended')
  }else if(profileInfo?._id){
    redirect("/");
  }
   else return (
    <Onboard/>
  )
}

export default OnboardPage