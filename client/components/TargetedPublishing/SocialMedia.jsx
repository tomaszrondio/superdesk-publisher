import React, {Component} from 'react';
import axios from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';

import {ToggleBox} from '../UI/ToggleBox';
import ButtonListItem from '../UI/ButtonListItem';
import SocialMediaOverlay from './SocialMediaOverlay';

class SocialMedia extends Component {
    constructor(props) {
        super(props);

        this.state = {
            overlayOpen: false,
            overlayType: '',
            metaData: {},
            isUploadingInProgress: false
        };
    }

    componentDidMount() {
        if (!this.props.item.associations) return;
        this.getMetaData();
    }

    getMetaData = () => {
        axios.get(this.props.apiUrl + 'seo/' + this.props.item.guid, {headers: this.props.apiHeader})
            .then(res => {
                this.setState({
                    metaData: res.data
                });
            })
            .catch(err => {
                this.setState({
                    metaData: {
                        meta_title: null,
                        meta_description: null,
                        og_title: null,
                        og_description: null,
                        twitter_title: null,
                        twitter_description: null
                    }
                });
            });
    }

    setMetaData = metaData => {
        this.setState(
            {metaData},
            () =>  this.debouncedSave()
        );
    }

    saveMetaData = () => {
        let metaData = _.omitBy({...this.state.metaData}, _.isNil);

        delete metaData._links;

        return axios.patch(this.props.apiUrl + 'seo/' + this.props.item.guid, metaData, {headers: this.props.apiHeader})
            .catch(err => {
                if (err.response.status === 404) {
                    metaData.package_guid = this.props.item.guid;
                    axios.post(this.props.apiUrl + 'seo/', metaData, {headers: this.props.apiHeader});
                }
            });
    }

    debouncedSave = _.debounce(this.saveMetaData, 2000, { 'maxWait': 5000 });

    uploadImage = e => {
        const files = Array.from(e.target.files);
        const name = e.target.name;
        let formData = new FormData();

        formData.append('packageGuid', this.props.item.guid);
        formData.append(name, files[0]);

        let headers = {...this.props.apiHeader, 'Content-Type': 'multipart/form-data'};

        this.setState({isUploadingInProgress: true});
        axios.post(this.props.apiUrl + 'seo/', formData, {headers: headers})
            .then(res => {
                if (res.data._links) {
                    let metaData = {...this.state.metaData};

                    metaData._links = res.data._links;
                    this.setState({metaData});
                    // sending patch to update values overwritten by post with image
                    this.saveMetaData()
                        .then(res => this.setState({isUploadingInProgress: false}));
                }
            });
    }

    toggleOverlay = type => {
        this.setState({
            overlayOpen: !this.state.overlayOpen,
            overlayType: type
        });

        if (type) this.scrollTop();
    }

    // a little hacky but there is no other way
    scrollTop = () => {
        let scrollElem = document.querySelector("div.side-panel__content-block--overlay-panel-inside div[sd-extension-point='authoring:publish']");

        scrollElem.scrollTop = 0;
    }

    render() {
        return (
            <React.Fragment>
                <ToggleBox title="Social media" style="toggle-box--dark sp--dark-ui toggle-box--circle" isOpen={true}>
                    <div className="sd-list-item-group sd-shadow--z1">
                        <ButtonListItem onClick={() => this.toggleOverlay('Facebook')} label="Facebook"/>
                        <ButtonListItem onClick={() => this.toggleOverlay('Twitter')} label="Twitter"/>
                        <ButtonListItem onClick={() => this.toggleOverlay('SEO')} label="SEO"/>
                    </div>
                </ToggleBox>
                <SocialMediaOverlay
                    isOpen={this.state.overlayOpen}
                    toggle={() => this.toggleOverlay('')}
                    type={this.state.overlayType}
                    metaData={this.state.metaData}
                    setMetaData={(metaData) => this.setMetaData(metaData)}
                    uploadImage={(e) => this.uploadImage(e)}
                    isUploadingInProgress={this.state.isUploadingInProgress}
                />
            </React.Fragment>
        )
    }

}

SocialMedia.propTypes = {
    apiUrl: PropTypes.string.isRequired,
    apiHeader: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired
}


export default SocialMedia;
