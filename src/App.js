/* eslint-disable dot-notation */
import React, { useState } from 'react'
import { Container, Row, Col, Form, Card } from 'react-bootstrap'
import axios from 'axios'

function App() {
  const [addressText, setAddressText] = useState('')
  const [addresses, setAddresses] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const onChangeHandler = (e) => {
    const { value } = e.currentTarget
    setAddressText(value)

    if (value === '') {
      setShowSuggestions(false)
      return
    }

    const addrArr = []
    axios
      .get(`http://localhost:8000/v1.0/addresses/match?text=${value}`)
      .then((res) => {
        if (res.data.hits.hits.length === 0) {
          console.log('No matches')
          setShowSuggestions(false)
        } else {
          res.data.hits.hits.forEach((hit) => {
            const addrObj = {
              line1: hit['_source'].line1,
              city: hit['_source'].city,
              state: hit['_source'].state,
              zip: hit['_source'].zip,
            }
            addrArr.push(addrObj)
          })
          setAddresses(addrArr)
          if (addrArr.length > 0) setShowSuggestions(true)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const cardClickHandler = (addrObj) => {
    setAddressText(
      `${addrObj.line1}, ${addrObj.city}, ${addrObj.state} ${addrObj.zip}`,
    )
  }

  return (
    <>
      <Container style={{ marginTop: '50px' }}>
        <Row
          className="justify-content-md-center"
          style={{ marginBottom: '30px' }}
        >
          <Col xs={12} md={12} lg={7}>
            <h1>Address Suggester (if that&rsquo;s even a thing)</h1>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xs={12} md={12} lg={5}>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  size="lg"
                  onChange={onChangeHandler}
                  value={addressText}
                />
                <Form.Text className="text-muted">
                  Type any part of your address. We&rsquo;ll try to find it!
                </Form.Text>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        {showSuggestions &&
          addresses.map((addrObj, idx) => (
            <Row
              className="justify-content-md-center"
              style={{ marginBottom: '30px' }}
              index={idx}
            >
              <Col xs={12} md={12} lg={7}>
                <Card
                  style={{ width: '18rem', cursor: 'pointer' }}
                  onClick={() => cardClickHandler(addrObj)}
                >
                  <Card.Body>
                    <Card.Title>Match!</Card.Title>
                    <Card.Text>
                      {addrObj.line1}
                      <br />
                      {addrObj.city}
                      <br />
                      {addrObj.state}
                      <br />
                      {addrObj.zip}
                      <br />
                    </Card.Text>
                  </Card.Body>
                </Card>{' '}
              </Col>
            </Row>
          ))}
      </Container>
    </>
  )
}

export default App
