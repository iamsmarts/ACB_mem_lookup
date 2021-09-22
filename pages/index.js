import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { useCallback, useRef, useState } from 'react';
import SearchField from 'react-search-field'
import {supabase} from '../utils/supaConfig'
import {faInstagram, faTwitter, faFacebook} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import header from '../public/header-update.jpg'



export async function getServerSideProps({ query }) {

    let data = await supabase
        .from('Members')
        .select('*')

    data = data.body

    const members = data.map((mem, i)=>{
        let member = {
            name : `${mem.firstName} ${mem.lastName},`,
            email: mem.email,
            id: mem.memberID
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
        <div className="row hero">
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
        <div className="row navi justify-content-end">
          <div className="col-6 ">
            <ul className="nav justify-content-end">
              <li className="nav-item ni1">
                <Link className="nav-link active"  href="https://acb.la"><a>HOME</a></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="https://shop.acb.la"><a>SHOP</a></Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="searchTitle row justify-content-start">
          <div className="col-md-8 offset-md-2 align-self-center text-center">
          <h1 className="">Member ID Lookup</h1>
          <p>Enter your email in the field below to lookup your Member ID. <br/></p>

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
                    classNames="form-control form-control-lg"
                />
          </div>
          <p className="dups text-center"><em>If you have more than one membership under the same email, please reach out to us <Link href="mailto:info@acb.la"><a>info@acb.la</a></Link></em></p>
        </div>
        {results.length > 0 &&(
          <div className="row">
            <div className="col-md-6 offset-md-3 align-self-center">
              <h2 className="text-center">{results}</h2>
            </div>
          </div>
        )}
        <div className="footer row text-center">
          <div className="col"><p>Angel City Brigade - 501 C 7</p></div>
          <div class="w-100"></div>
          <div className="col">
            <Link href="https://instagram.com/angelcitybrigade"><a><FontAwesomeIcon icon={faInstagram}/> </a></Link>
            <Link href="https://twitter.com/ACBxLA"><a><FontAwesomeIcon icon={faTwitter}/> </a></Link>
            <Link href="https://facebook.com/angelcitybrigade"><a><FontAwesomeIcon icon={faFacebook}/> </a></Link>
          </div>
        </div>
      </div>
    )
}