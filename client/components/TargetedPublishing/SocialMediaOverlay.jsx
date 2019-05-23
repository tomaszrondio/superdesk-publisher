import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import ImageUpload from '../UI/ImageUpload';
class SocialMediaOverlay extends Component {

    handleInputChange = (e, a) => {
        let {name, value} = e.target;
        let newData = {...this.props.metaData};

        newData[name] = value;
        this.props.setMetaData(newData);
    };

    render() {

        let imageFieldName = "ogMediaFile";
        let titleFieldName = "og_title";
        let descriptionFieldName = "og_description";
        let imageHref = this.props.metaData._links && this.props.metaData._links.og_media_url ? this.props.metaData._links.og_media_url.href : '';

        if (this.props.type === 'Twitter') {
            imageFieldName = "twitterMediaFile";
            titleFieldName = "twitter_title";
            descriptionFieldName = "twitter_description";
            imageHref = this.props.metaData._links && this.props.metaData._links.twitter_media_url ? this.props.metaData._links.twitter_media_url.href : '';
        }

        if (this.props.type === 'SEO') {
            imageFieldName = "metaMediaFile";
            titleFieldName = "meta_title";
            descriptionFieldName = "meta_description";
            imageHref = this.props.metaData._links && this.props.metaData._links.meta_media_url ? this.props.metaData._links.meta_media_url.href : '';
        }

        return (
            <div className={classNames('side-panel__content-block-overlay',{'side-panel__content-block-overlay--open': this.props.isOpen })}>
                <div className="side-panel">
                    <div className="side-panel__header">
                        <a className="icn-btn sd-margin-l--1" onClick={this.props.toggle} sd-tooltip="Back" flow="right"><i className="icon-arrow-left"></i></a>
                        <h3 className="side-panel__heading side-panel__heading--big">{this.props.type}</h3>
                    </div>
                    <div className="side-panel__content">
                        <div className="side-panel__content-block">
                            <div className="form__row">
                                <ImageUpload
                                    href={imageHref}
                                    upload={(e) => this.props.uploadImage(e)}
                                    fieldName={imageFieldName}
                                    isUploadingInProgress={this.props.isUploadingInProgress}
                                />
                            </div>
                            <div className="form__row">
                                <div className="sd-line-input sd-line-input--required sd-line-input--dark-ui sd-line-input--boxed">
                                    <label className="sd-line-input__label">Title</label>
                                    <input className="sd-line-input__input"
                                        type="text"
                                        name={titleFieldName}
                                        value={this.props.metaData[titleFieldName] ? this.props.metaData[titleFieldName] : ''}
                                        onChange={this.handleInputChange}/>
                                </div>
                            </div>
                            <div className="form__row">
                                <div className="sd-line-input sd-line-input--required sd-line-input--dark-ui sd-line-input--boxed">
                                    <label className="sd-line-input__label">Description</label>
                                    <textarea className="sd-line-input__input"
                                        name={descriptionFieldName}
                                        value={this.props.metaData[descriptionFieldName] ? this.props.metaData[descriptionFieldName] : ''}
                                        onChange={this.handleInputChange}>
                                    </textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

SocialMediaOverlay.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    metaData: PropTypes.object.isRequired,
    setMetaData: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    isUploadingInProgress: PropTypes.bool
};

export default SocialMediaOverlay;
