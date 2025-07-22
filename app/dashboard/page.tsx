import { redirect } from 'next/navigation'
import React from 'react'

const Dashboard = () => {
    redirect("/login")
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard