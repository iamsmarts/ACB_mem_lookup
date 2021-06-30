import Head from 'next/head'
import Image from 'next/image'

import { google } from 'googleapis'
import { useCallback, useRef, useState } from 'react';
import SearchField from 'react-search-field'

import header from '../public/header-update.jpg'

export async function getServerSideProps({ query }) {
    const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
    const sheets = google.sheets({ version: 'v4', auth });

    const range = `master!A2:E475`

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range,
    })

    const data = response.data.values

    const members = data.map((mem, i)=>{
        let member = {
            name : `${mem[2]} ${mem[3]}`,
            email: mem[4],
            id: mem[0]
        }
        return member
    })

    return{
        props:{
            members
        }
    }
}

export default function List({members}){
    const searchRef = useRef(null)
    const [query, setQuery] = useState('')
    const [active, setActive] = useState(false)
    const [results, setResults] = useState([])

    const onChange = (value)=>{
        value = value.replace(/\s+/g, '')
        setQuery(value)
        let memFound =''
        const listCheck = members.map((mem, i)=>{
            if(mem.email === value){
                memFound = `${mem.name} your member ID is : #${mem.id}`
                return memFound
            }
        })
        console.log(memFound.length)

        if(memFound.length > 0){
          setActive(true)
          setResults(memFound)
        }else{
          setResults('Sorry the email you submitted was not found, please check your email and try again.')
        }
    }

    const onFocus = useCallback(()=>{
        setActive(true)
        window.addEventListener('click', onClick)
    },[])

    const onClick = useCallback((event)=>{
        if(searchRef.current && !searchRef.current.contains(event.target)){
            setActive(false)
            window.removeEventListener('click', onClick)
        }
    }, [])


    return(
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="imageWrap">
              <Image
                alt="ACB Member ID Lookup"
                src={header}
                className="headerImage"
              />
            </div>
          </div>
        </div>
        <div className="searchTitle row justify-content-start">
          <div className="col-md-6 offset-md-3 align-self-center">
          <h1 className="text-center">Please enter your email to look up your member ID</h1>
          </div>
        </div>
        <div className="row">
          <div
            className="searchField col-md-6 offset-md-3"
            ref={searchRef}>
                <SearchField
                    placeholder="Please enter member email"
                    onSearchClick={onChange}
                    onEnter={onChange}
                />
          </div>
        </div>
        {results.length > 0 &&(
        <div className="row">
          <div className="col-md-6 offset-md-3 align-self-center">
            <h2 className="text-center">{results}</h2>
          </div>
          </div>
        )}
      </div>

    )
}