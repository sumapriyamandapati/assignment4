import React, {useEffect, useState} from "react";
import './Products.scss'
import {AddProduct} from "./AddProduct";
import {gql, useQuery} from "@apollo/client";

const GET_ALL_PRODUCTS = gql(`
    query Query {
      getAllProducts {
        id
        Category
        Name
        Price
      }
    }
`)

enum Category {
    Shirts = "Shirts",
    Jeans = "Jeans",
    Jackets = "Jackets",
    Sweaters = "Sweaters",
    Accessories = "Accessories"
}

export interface Product {
    id: string
    Category: string
    Name: string
    Price: number
    Image: string
}

export interface ProductProps {
    products: Array<Product>
}

export interface ProductRowProps {
    product: Product
}

const ProductRow = (props: ProductRowProps) => (
    <tr>
        <td>{props.product?.id + 1}</td>
        <td>{props.product?.Name}</td>
        <td>{props.product?.Price}</td>
        <td>{props.product?.Category}</td>
        <td><a href={props.product?.Image} target="_blank" className={"view-image"}><u>View</u></a></td>
    </tr>
)

const ProductTable = (props: ProductProps) => {
    const productRows = props.products?.map(product => <ProductRow key={product?.id} product={product} />);
    return (
        <table className="bordered-table column-width">
            <thead>
            <tr>
                <th>Id</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Image</th>
            </tr>
            </thead>
            <tbody>{productRows}</tbody>
        </table>
    );
}

export const Products = (props: any) => {

    const [state, setState] = useState<{ products: Array<Product>, error: boolean }>({ products: [], error: false })

    const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);

    useEffect(() => {
        if (error) {
            setState({ ...state, error: true })
        } else {
            getProducts()
        }
    }, [data, error])

    function getProducts() {

        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        setState({ ...state, products: data.getAllProducts })
    }

    return (
        <div className="main_div">
            {
                state.error && <div className="alert alert-danger" role="alert">
                    This is a danger alert—check it out!
                </div>
            }
            <h1>My Company Inventory</h1>
            <div className="table_heading">Showing all available products.</div>
            <ProductTable products={state.products} />
            <div className="form_heading">Add a new product to inventory</div>
            <AddProduct products={state} setProducts={setState}/>
        </div>
    )

}
