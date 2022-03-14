import React, {Dispatch, SetStateAction, useEffect} from "react"
import "./Products.scss"
import {gql, useMutation} from "@apollo/client";
import {Product} from "./Products";

// Define mutation
const ADD_PRODUCT = gql(`
    # Add new product
    mutation Mutation($product: ProductInput) {
      addNewProduct(product: $product) {
        id
        Category
        Name
        Price
        Image
      }
    }
`);

export interface AddProductProps {
    products: { products: Array<Product> }
    setProducts: Dispatch<SetStateAction<{ products: Array<Product>, error: boolean }>>
}

export const AddProduct = (props: AddProductProps) => {

    const [addProduct, { data, error }] = useMutation(ADD_PRODUCT);

    useEffect(() => {
        if (error) {
            props.setProducts({ products: [ ...props.products.products], error: true })
        }
        if (data) {
            props.setProducts({ products: [ ...props.products.products, data.addNewProduct], error: false })
        }
    }, [data])

    function handleSubmit(e: any) {
        e.preventDefault()
        const formData = new FormData(e.target)
        addProduct({
            variables: {
                "product": {
                    "Category": formData.get("category"),
                    "Name": formData.get("productName"),
                    "Price": formData.get("price") ? isNaN(parseFloat(formData.get("price") as string)) ? 0.0 : parseFloat(formData.get("price") as string) : 0.0,
                    "Image": formData.get("imageUrl")
                }
            }
        }).then(() => {
            e.target.reset()
        })
    }

    return (
        <div>
            <form name="productAdd" onSubmit={ (e) => handleSubmit(e) }>
                <div className={"form-row"}>
                    <div className="form-group col-sm-6">
                        <label>Category</label>
                        <select name={"category"} id="category" required={true} className="form-control">
                            <option value="Shirts">Shirts</option>
                            <option value="Jeans">Jeans</option>
                            <option value="Jackets">Jackets</option>
                            <option value="Sweaters">Sweaters</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>
                    <div className="form-group col-sm-6">
                        <label>Price</label>
                        <input className="form-control" required={true} type="text" name="price" />
                    </div>
                </div>
                <div className={"form-row"}>
                    <div className="form-group col-sm-6">
                        <label>Product Name</label>
                        <input className="form-control" type="text" name="productName" />
                    </div>
                    <div className="form-group col-sm-6">
                        <label>Image URL</label>
                        <input className="form-control" type="text" name="imageUrl" />
                    </div>
                </div>
                <button type={"submit"} className="btn btn-primary add-product" >Add Product</button>
            </form>
        </div>
    )
}
