import styled from 'styled-components';
import Image from 'next/image';

const Banner = styled.div`
  font-family: var(--font-family);
  margin: 16px 0;
  // background-color: #e6f7ff;
  background-color: #bcc9fd;
  color: #444444;
  border-radius: 0.5rem;
`;

const BannerHeader = styled.header`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 8px;
  margin-top: 24px;

  @media (min-width: 600px) {
    display: flex;
    align-items: center;
    padding: 16px;
    margin-top: 72px;
  }
`;

const BannerHeaderText = styled.div`
  text-align: left;

  @media (min-width: 600px) {
    margin-left: 16px;
  }
`;

const BannerBody = styled.p`
  font-size: 16px;
  background-color: #bcc9fd;
  padding-left: 16px;
  padding-right: 16px;
`;

const BannerCTA = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 16px;
  display: flex;
  flex-direction: row-reverse;
`;

// TODO: Add timer counting down days until full migration complete (March 20).

/**
 * Information about the upcoming UTD Grades upgrade to the Nebula Data Service.
 */
export default function MigrationNotice() {
  return (
    <Banner>
      <BannerHeader>
        <div>
          <Image
            src="/assets/nebula-data-service-logo.svg"
            height="64"
            width="64"
          />
        </div>
        <BannerHeaderText>UTD Grades is getting an upgrade.</BannerHeaderText>
      </BannerHeader>
      <BannerBody>
        UTD Grades is now a part of{' '}
        <a href="https://about.utdnebula.com">Project Nebula</a>! In the future,
        you&apos;ll be able to see professor evaluations and other data. In the
        meantime, the UTD grades you know won't change for fall 2021. In the
        meantime, you&apos;ll be able to access UTD Grades via{' '}
        <a href="https://grades.utdnebula.com">grades.utdnebula.com</a> and
        utdgrades.com.
        <br />
        P.S. If you&apos;re a developer interested in the migration, see the{' '}
        <a href="https://github.com/acmutd/utd-grades/issues/16">
          utd-grades
        </a>{' '}
        and{' '}
        <a href="https://github.com/acmutd/nebula-data-service/issues/8">
          nebula-data-service
        </a>{' '}
        repositories on GitHub.
      </BannerBody>
      <BannerCTA>
        {/* TODO: Re-enable once the blog post is up. */}
        {/* <a href="https://about.utdnebula.com/blog/utd-grades-migration">
          Learn more about the migration.
        </a> */}
      </BannerCTA>
    </Banner>
  );
}
