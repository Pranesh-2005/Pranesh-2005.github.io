const StyledMedia = styled.video`
  display: block;
  margin: 32px auto 0 auto;
  max-width: 400px;
  width: 100%;
  border-radius: ${theme.borderRadius}px;
  background-color: ${colors.lightNavy};
`;

const Skills = ({ data }) => {
  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);

  const revealContainer = useRef(null);
  useEffect(() => sr.reveal(revealContainer.current, srConfig()), []);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
    } else {
      if (tabFocus >= tabs.current.length) setTabFocus(0);
      if (tabFocus < 0) setTabFocus(tabs.current.length - 1);
    }
  };

  useEffect(() => focusTab(), [tabFocus]);

  const onKeyPressed = e => {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
      setTabFocus(tabFocus + (e.keyCode === 40 ? 1 : -1));
    }
  };

  return (
    <StyledContainer id="skills" ref={revealContainer}>
      <Heading>Languages and Tools I&apos;m Good At</Heading>
      <StyledTabs>
        <StyledTabList role="tablist" aria-label="Skill tabs" onKeyDown={onKeyPressed}>
          {data &&
            data.map(({ node }, i) => {
              const { title } = node.frontmatter;
              return (
                <li key={i}>
                  <StyledTabButton
                    isActive={activeTabId === i}
                    onClick={() => setActiveTabId(i)}
                    ref={el => (tabs.current[i] = el)}
                    id={`tab-${i}`}
                    role="tab"
                    aria-selected={activeTabId === i}
                    aria-controls={`panel-${i}`}
                    tabIndex={activeTabId === i ? '0' : '-1'}>
                    <span>{title}</span>
                  </StyledTabButton>
                </li>
              );
            })}
          <StyledHighlight activeTabId={activeTabId} />
        </StyledTabList>

        {data &&
          data.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { title, gif } = frontmatter;
            return (
              <StyledTabContent
                key={i}
                isActive={activeTabId === i}
                id={`panel-${i}`}
                role="tabpanel"
                aria-labelledby={`tab-${i}`}
                tabIndex={activeTabId === i ? '0' : '-1'}
                hidden={activeTabId !== i}>
                <StyledJobTitle>
                  <span>{title}</span>
                </StyledJobTitle>
                {gif && gif.publicURL && (
                  <StyledMedia
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={gif.publicURL}
                    type="video/mp4"
                    aria-label={`${title} video demonstration`}
                  />
                )}
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </StyledTabContent>
            );
          })}
      </StyledTabs>
    </StyledContainer>
  );
};

Skills.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Skills;