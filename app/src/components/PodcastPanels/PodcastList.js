import getPlaceholderImageURL from '../../util/getPlaceholderImageURL';
import Img from 'react-image';
import React from 'react';
import Panel from '../Panel';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class PodcastList extends React.Component {
	render() {
		return (
			<Panel
				hasHighlight={
					this.props.match.params.podcastID &&
					this.props.match.params.podcastID !== 'recent'
				}
				headerText="Podcasts"
				headerLink="/podcasts"
			>
				{this.props.podcasts.map((podcast) => {
					return (
						<Link
							className={
								this.props.match.params.podcastID === podcast._id
									? 'highlighted'
									: ''
							}
							key={podcast._id}
							to={`/podcasts/${podcast._id}`}
						>
							<Img
								src={[
									podcast.images.favicon,
									getPlaceholderImageURL(podcast._id),
								]}
								loader={<div className="placeholder" />}
							/>
							<div>{podcast.title}</div>
							<div>
								<i className="fa fa-chevron-right" />
							</div>
						</Link>
					);
				})}
			</Panel>
		);
	}
}

PodcastList.propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.shape({
		params: PropTypes.shape({
			podcastID: PropTypes.string,
		}),
	}),
	podcasts: PropTypes.arrayOf(PropTypes.shape({})),
};

const mapStateToProps = (state) => {
	if (!state.podcasts) return { podcasts: [] };

	let podcasts = Object.values(state.podcasts);
	podcasts.sort((a, b) => a.title.localeCompare(b.title));

	if (state.aliases) {
		podcasts = podcasts.map((podcast) => {
			if (state.aliases[podcast._id])
				podcast.title = state.aliases[podcast._id].alias;
			return podcast;
		});
	}
	return { podcasts };
};

export default connect(mapStateToProps)(withRouter(PodcastList));
