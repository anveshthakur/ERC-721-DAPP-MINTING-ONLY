import React from 'react'
import {Card} from 'react-bootstrap';


const ColorCard = ({Name}) => {
    return (
        <>
        <Card style={{ width: '18rem', "marginBottom": "1.5rem" }}>
        <Card.Body style = {{"backgroundColor": Name,"height":"10rem"}} />
        <Card.Body>
            <Card.Title>{Name}</Card.Title>
            <Card.Text>
                Owned By: to be diplayed
            </Card.Text>
        </Card.Body>
        </Card>   
        </>
    )
}

export default ColorCard
