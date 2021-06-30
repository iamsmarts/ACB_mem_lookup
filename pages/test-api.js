import { google } from 'googleapis'
import { useCallback, useRef, useState } from 'react';
import SearchField from 'react-search-field'

export async function getServerSideProps({ query }) {
    const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
    const sheets = google.sheets({ version: 'v4', auth });

    const {id} = query
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
        let memFound
        const listCheck = members.map((mem, i)=>{
            if(mem.email === value){
                memFound = `${mem.name} your member ID # is : ${mem.id}`
                setActive(true)
                setResults(memFound)
                return memFound
            }
        })
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
    console.log(results, active, results.length)
    return(
        <div
        ref={searchRef}>
            <SearchField
                placeholder="Please enter member email"
                onSearchClick={onChange}
            />
            {active && results.length > 0 &&(
                <p>{results}</p>
            )}

        </div>
    )
}