import React, { useEffect,useState } from 'react'
import Axios from 'axios';
import { Icon, Col, Card,Row } from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import SearchFeature from './Sections/SearchFeature';

const {Meta} = Card;


function LandingPage() {

    const [Products,setProducts]=useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [SearchTerms, setSearchTerms] = useState("")

    useEffect(() => {
        const variables = {
            skip: Skip,
            limit: Limit
        }
        
        getProducts(variables)
    }, [])

    const getProducts = (variables) => {
        Axios.post('/api/product/getProducts', variables).then(response => {
            if (response.data.success) {
                if (variables.loadMore) {
                    setProducts([...Products, ...response.data.products])
                } else {
                    setProducts(response.data.products)
                }
                setPostSize(response.data.postSize)
                console.log(response.data.products)
            } else {
                alert('Failed to fectch product datas')
            }
        })

    }

    const onLoadMore = ( ) => {
        let skip = Skip + Limit;
        
        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            searchTerm: SearchTerms
        }

        getProducts(variables)
        
        setSkip(skip)
    }

    const renderCards = Products.map(( product, index ) => {

        // change number to rupiah
        let reverse = product.price.toString().split('').reverse().join(''),
            ribuan = reverse.match(/\d{1,3}/g);
        ribuan = ribuan.join('.').split('').reverse().join('');
        
        return <Col lg={6} md={8} xs={12} key={index}>
            <Card hoverable={true} cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images}/></a>}>
                <Meta title={product.title} description={`Rp${ribuan}`}>

                </Meta>
            </Card>
        </Col>
    })

    const updateSearchTerms = (newSearchTerm) => {

        const variables = {
            skip: 0,
            limit: Limit,
            searchTerm: newSearchTerm
        }
        setSkip(0)
        setSearchTerms(newSearchTerm)

        getProducts(variables)
    }

    return ( 
        <div style={{ width: '75%', margin: '3rem auto'}}>
            <div style={{ textAlign: 'center' }}>
                <h2> Selamat Datang di SecondHand Store, <br/> Selamat Belanja!!! </h2>
            </div>

            { /* Filter */}

            { /* Search */}

            <div style={{ display:'flex', justifyContent:'flex-end', margin:'1rem auto'}}>
                    <SearchFeature refreshFunction={updateSearchTerms}/>
            </div>

            {Products.length === 0 ?
                <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center'}}>
                    <h2> No post yet... </h2>
                </div> :
                <div>
                    <Row gutter={[16,16]}>
                        {renderCards}
                    </Row>
                </div>    
            }

            <br/><br/>

            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={onLoadMore}> Load More </button>
                </div>
            }

        </div>
    )
}

export default LandingPage