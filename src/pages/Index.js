import React from 'react';
import differenceBy from 'lodash/differenceBy';

//  Material UI
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';

// Bootstrap
import { Container, Row, Jumbotron, Col, Form, Button, Modal } from 'react-bootstrap';

// Memoize
import memoize from 'memoize-one';

// Data Table
import DataTable from 'react-data-table-component';

// API Services
import { getUserList } from '../utils/Api';

const sortIcon = <ArrowDownward />;
const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

// Popup
const ShowPopup = ({ togglePopup, show, callBack, data, isNew }) => {
    const [title, setTitle] = React.useState();
    React.useEffect(() => { setTitle(data && data.title); }, [data]);
    return (

        <>
            <Modal show={show} onHide={togglePopup} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Album ID</Form.Label>
                            <Form.Control type="text" value={data && data.albumId} disabled />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="text" value={data && data.id} disabled />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Form.Group>
                    </Form.Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={togglePopup}>
                        Close
              </Button>
                    <Button variant="primary" onClick={() => callBack(title)}>
                        Save Changes
              </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

// Delete
const contextActions = memoize((deleteHandler) => (

    <IconButton
        color="secondary"
        onClick={deleteHandler}>
        <Delete />
    </IconButton>

));

// Data 
const columns = memoize((deleteHandler, onSelectEdit) => [
    {
        cell: row => <div row={row} onDeleteRow={deleteHandler} />,
        allowOverflow: true,
        button: true,
        width: '56px',
    },
    {
        name: 'Album ID',
        selector: 'albumId',
        sortable: true,
        width: '150px',
    },
    {
        name: 'ID',
        selector: 'id',
        sortable: true,
        width: '100px',
    },
    {
        name: 'Title',
        selector: 'title',
        sortable: true,
        width: '250px',
    },
    {
        name: 'Thumbnail',
        selector: 'thumbnailUrl',
        cell: row => <img className="thumb" alt="Thumbnail" src={row.thumbnailUrl} />,
        sortable: true,
        width: '150px',

    },
    {
        name: 'Source',
        selector: 'url',
        cell: row => <img className="large" alt="Main Source" src={row.url} />,
        sortable: true,
        width: '200px',
    },
    {
        name: 'Action',
        cell: (row) => <Button variant="info" color="primary" onClick={() => onSelectEdit(row)}>Edit</Button>,
        button: true,
        right: true
    },
]);



export default class Index extends React.Component {

    isNew = false


    state = {
        selectedRows: [],
        toggleCleared: false,
        data: this.data,
        show: false,
        filterText: ''
    };

    togglePopup = () => this.setState({ show: !this.state.show });

    handleChange = state => {
        this.setState({ selectedRows: state.selectedRows });
    };

    // Popup Action
    actions = (
        <IconButton onClick={() => {
            this.isNew = true
            this.togglePopup()
        }}
            color="primary">
            <Add />
        </IconButton>
    );

    // Pop on edit
    onSelectEdit = (row) => {
        this.selectedData = row
        this.togglePopup()
    }

    // Row edit or add
    addOrEdit = (title) => {
        if (this.isNew) {
            const { data } = this.state;

            const updatedData = this.updateObjectInArray(data, 0, { title, albumId: data.length + 1, id: data.length + 1, url: "https://dummyimage.com/600x400/0ddaa9/ffffff&text", thumbnailUrl: "https://dummyimage.com/150x100/71bf85/ffffff&" })

            this.fullData = updatedData;

            this.setState({ data: updatedData }, this.togglePopup)

        } else {
            const { data } = this.state;

            const index = data.findIndex((e) => e.id = this.selectedData.id);

            this.selectedData.title = title;

            const updatedData = this.updateObjectInArray(data, index, this.selectedData)

            this.fullData = updatedData;

            this.setState({ data: updatedData }, this.togglePopup)
        }
        this.selectedData = null;
        this.isNew = false
    }

    // Update Table
    updateObjectInArray(array, index, updatedItem) {
        return array.map((item, i) => {
            if (i !== index) {
                // if not the item then bail
                return item
            }

            // Return the new item. we updated the object "deeply" and because map returns a new array
            return {
                ...item,
                ...updatedItem,
            }
        })
    }


    // Delete bulk
    deleteAll = () => {

        const { selectedRows } = this.state;
        const rows = selectedRows.map(r => r.id);

        if (window.confirm(`Are you sure you want to delete:\r ${rows}?`)) {

            const updatedData = differenceBy(this.state.data, this.state.selectedRows, 'id')
            this.fullData = updatedData
            this.setState(state => ({ toggleCleared: !state.toggleCleared, data: updatedData }));
        }
    }


    // Single Delete
    deleteOne = row => {

        if (window.confirm(`Are you sure you want to delete:\r ${row.id}?`)) {
            const { data } = this.state;
            const index = data.findIndex(r => r === row);
            const updatedData = [...this.state.data.slice(0, index), ...this.state.data.slice(index + 1)]
            this.fullData = updatedData
            this.setState(state => ({
                toggleCleared: !state.toggleCleared,
                data: updatedData,
            }));
        }
    }

    // Function Call
    componentDidMount() {
        this.getUserData();
    }

    //Api call to fetch data
    getUserData = (page) => {
        getUserList(page).then(response => {
            this.fullData = response
            this.setState({ isLoading: false, data: response })
        })
    }

    onFilter = (e) => {
        const value = e.target.value
        const filteredItems = this.state.data.filter(item => item.title && item.title.toLowerCase().includes(value.toLowerCase()));
        this.setState({ data: filteredItems, filterText: value })
    }

    onClear = () => {
        this.setState({ data: this.fullData, filterText: '' })

    }


    render() {
        const { data, toggleCleared, show } = this.state;

        return (
            <>
                <div className="home">
                    <Jumbotron>
                        <Container>
                            <h1>Photo Book Management</h1>
                            <p>Page Tagline goes here</p>
                        </Container>
                    </Jumbotron>
                    <div className="home-content">
                        <Container>
                            <Row>
                                <Col>
                                    <div className="table-filter">
                                        <Form.Control id="search" type="text" placeholder="Filter By Title" value={this.state.filterText} onChange={this.onFilter} />
                                        <Button type="button" onClick={this.onClear}>Clear</Button>
                                    </div>
                                    <Card style={{ height: '100%' }}>
                                        <DataTable
                                            title="Manage your album"
                                            columns={columns(this.deleteOne, this.onSelectEdit)}
                                            data={data}
                                            highlightOnHover
                                            actions={this.actions}
                                            contextActions={contextActions(this.deleteAll)}
                                            sortIcon={sortIcon}
                                            selectableRows
                                            selectableRowsComponent={Checkbox}
                                            selectableRowsComponentProps={selectProps}
                                            onSelectedRowsChange={this.handleChange}
                                            clearSelectedRows={toggleCleared}
                                            onRowClicked={this.handleRowClicked}
                                            pagination
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </div >
                </div >
                <ShowPopup togglePopup={this.togglePopup} callBack={this.addOrEdit} show={show} data={this.selectedData} isNew={this.isNew} />
            </>
        );
    }
}


