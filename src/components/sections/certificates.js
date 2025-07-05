import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { FormattedIcon } from '@components/icons';
import styled from 'styled-components';
import { theme, mixins, media, Section, Heading } from '@styles';
const { colors, fontSizes, fonts } = theme;

const StyledContainer = styled(Section)`
  ${mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
`;
const StyledContent = styled.div`
  position: relative;
  grid-column: 1 / 7;
  grid-row: 1 / -1;
  max-width: 95%;
  z-index: 4;
  background: transparent;

  ${media.thone`
    grid-column: 1 / -1;
    padding: 40px 40px 30px;
    z-index: 5;
    max-width: 100%;
    order: 1;
  `};
`;

const StyledLabel = styled.h4`
  font-size: ${fontSizes.smish};
  font-weight: normal;
  color: ${colors.green};
  font-family: ${fonts.SFMono};
  margin-top: 10px;
  padding-top: 0;
`;
const StyledProjectName = styled.h5`
  font-size: 28px;
  margin: 0 0 20px;
  color: ${colors.lightestSlate};
  max-width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  z-index: 3;
  background: transparent;
  ${media.tablet`font-size: 24px;`};
  ${media.thone`color: ${colors.white};`};
  a {
    ${media.tablet`display: block;`};
    max-width: 100%;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: normal;
  }
`;
const StyledDescription = styled.div`
  ${mixins.boxShadow};
  position: relative;
  z-index: 2;
  padding: 25px;
  background-color: ${colors.lightNavy};
  color: ${colors.lightSlate};
  font-size: ${fontSizes.lg};
  border-radius: ${theme.borderRadius};
  ${media.thone`
    background-color: transparent;
    padding: 20px 0;
    box-shadow: none;
    &:hover {
      box-shadow: none;
    }
  `};
  p {
    margin: 0;
  }
  a {
    ${mixins.inlineLink};
  }
`;
const StyledTechList = styled.ul`
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 25px 0 10px;
  list-style: none;

  li {
    font-family: ${fonts.SFMono};
    font-size: ${fontSizes.smish};
    color: ${colors.green};
    margin-right: ${theme.margin};
    margin-bottom: 7px;
    white-space: nowrap;
    &:last-of-type {
      margin-right: 0;
    }
    ${media.thone`
      color: ${colors.green};
      margin-right: 10px;
    `};
  }
`;
const StyledLinkWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 10px;
  margin-left: -10px;
  color: ${colors.lightestSlate};
  a {
    padding: 10px;
    svg {
      width: 22px;
      height: 22px;
    }
  }
`;
const StyledFeaturedImg = styled(Img)`
  width: 100%;
  max-width: 100%;
  vertical-align: middle;
  border-radius: ${theme.borderRadius};
  position: relative;
  mix-blend-mode: multiply;
  filter: grayscale(100%) contrast(1) brightness(90%);
  ${media.tablet`
    object-fit: cover;
    width: auto;
    height: 100%;
    filter: grayscale(100%) contrast(1) brightness(80%);
  `};
`;
const StyledImgContainer = styled.a`
  ${mixins.boxShadow};
  grid-column: 6 / -1;
  grid-row: 1 / -1;
  position: relative;
  z-index: 1;
  background-color: ${colors.green};
  border-radius: ${theme.radius + 1}px;
  transition: ${theme.transition};

  ${media.tablet`height: 100%;`};

  ${media.thone`
    grid-column: 1 / -1;
    order: 2;
    opacity: 1;
    width: 100%;
  `};

  &:hover,
  &:focus {
    background: transparent;

    &:before,
    ${StyledFeaturedImg} {
      background: transparent;
      filter: none;
    }
  }

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 3;
    transition: ${theme.transition};
    background-color: ${colors.navy};
    mix-blend-mode: screen;

    ${media.thone`
      display: none;
    `};
  }
`;

const StyledProject = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 20px;
  align-items: center;
  position: relative;
  margin-bottom: 100px;

  ${media.thone`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 70px;
  `};

  &:last-of-type {
    margin-bottom: 0;
  }

  &:nth-of-type(odd) {
    ${StyledContent} {
      grid-column: 7 / -1;
      text-align: right;

      ${media.thone`
        grid-column: 1 / -1;
        text-align: left;
      `};
    }

    ${StyledImgContainer} {
      grid-column: 1 / 7;

      ${media.thone`
        grid-column: 1 / -1;
        order: 2;
      `};
    }
  }

  &:nth-of-type(even) {
    ${StyledContent} {
      grid-column: 1 / 7;
      text-align: left;

      ${media.thone`
        grid-column: 1 / -1;
        text-align: left;
      `};
    }

    ${StyledImgContainer} {
      grid-column: 7 / -1;

      ${media.thone`
        grid-column: 1 / -1;
        order: 2;
      `};
    }
  }
`;

const Certificates = ({ data }) => {
  const featuredProjects = data.filter(({ node }) => node);

  const revealTitle = useRef(null);
  const revealProjects = useRef([]);

  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => {
      if (ref) sr.reveal(ref, srConfig(i * 100));
    });
  }, []);

  return (
    <StyledContainer id="certificates">
      <Heading ref={revealTitle}>Certificates</Heading>

      <div>
        {featuredProjects &&
          featuredProjects.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { external, title, cover, web } = frontmatter;

            return (
              <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
                <StyledContent>
                  <StyledLabel>Featured Certificates</StyledLabel>
                  <StyledProjectName>
                    {external ? (
                      <a
                        href={external}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        aria-label="External Link"
                      >
                        {title}
                      </a>
                    ) : (
                      title
                    )}
                  </StyledProjectName>
                  <StyledDescription dangerouslySetInnerHTML={{ __html: html }} />
                  {/* {tech && (
                    <StyledTechList>
                      {tech.map((techItem, j) => (
                        <li key={j}>{techItem}</li>
                      ))}
                    </StyledTechList>
                  )} */}
                  <StyledLinkWrapper>
                    {/* {github && (
                      <a
                        href={github}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        aria-label="GitHub Link"
                      >
                        <FormattedIcon name="GitHub" />
                      </a>
                    )} */}
                    {web && (
                      <a
                        href={web}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        aria-label="External Link"
                      >
                        <FormattedIcon name="External" />
                      </a>
                    )}
                  </StyledLinkWrapper>
                </StyledContent>

                <StyledImgContainer
                  href={external}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  {cover?.childImageSharp?.fluid && (
                    <StyledFeaturedImg fluid={cover.childImageSharp.fluid} alt={title} />
                  )}
                </StyledImgContainer>
              </StyledProject>
            );
          })}
      </div>
    </StyledContainer>
  );
};

Certificates.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Certificates;
