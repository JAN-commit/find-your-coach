import React from 'react'
import CardContainer from '../Components/CardContainer'

export default function HomePage() {
    return (
        <div id='BODY' >

            <div className="">
                <div id="filter" className='border border-white px-5 py-1 '>
                    <div id="FILTER" className='text-2xl '>
                        <div className="font-semibold">Select Filer</div>

                        <div className=" flex flex-col sm:flex-row sm:space-x-3">
                            <div className="flex items-center space-x-2 ">
                                <input type="checkbox" id="frontend" className="w-4 h-4" />
                                <label htmlFor="frontend" className=''>Front End</label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="backend" className="w-4 h-4" />
                                <label htmlFor="backend" className=''>Back End</label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="fullstack" className="w-4 h-4" />
                                <label htmlFor="fullstack" className=''>Full Stack</label>
                            </div>
                        </div>

                    </div>
                </div>

                {/* <div id='button' className="flex justify-between py-5">

                    <button className='btn btn-primary font-semibold text-lg text-white '>Refresh List</button>
                    <button className='btn btn-primary font-semibold text-lg text-white '>Login to Register as Coach</button>
                </div> */}


            </div>




            <CardContainer />
        </div>
    )
}
