import React from 'react';
import { Popover } from 'antd';
import { HeartTwoTone, ThunderboltTwoTone } from '@ant-design/icons';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Body = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  position: relative;
  display: flex;
  align-items: stretch;
`;

const Footer = styled.div`
  text-align: center;
  width: 100%;
  display: block;
  font-family: var(--font-family);
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 150px;
  padding-bottom: 15px;

  @media (max-width: 992px) {
    & {
      padding-top: 15px;
    }
  }
`;

function Core({ children }) {
  const donors = (
    <div style={{ width: '300px' }}>
      <p>
        Thank you to the following people for donating and making this possible
        (in order of most monetary support): Anthony-Tien Huynh, Adam Butcher,
        Paul Denino, Thomas Sowders, Xavier Brown, Enza Denino, David Garvin,
        Alastair Feille, Andrew Vaccaro and other anonymous donors.
      </p>
    </div>
  );

  return (
    <Container>
      <Body>{children}</Body>
      <Footer>
        <p>
          Built with <HeartTwoTone twoToneColor="#eb2f96" /> by{' '}
          <a href="https://www.acmutd.co">ACM Labs</a> and powered{' '}
          <ThunderboltTwoTone twoToneColor="#ffcc00" /> by{' '}
          <a href="https://www.utdmercury.com">The Mercury</a>. Raw data
          available{' '}
          <a href="https://github.com/bharatari/utd-grades/tree/master/data">
            for download
          </a>
          .
        </p>
        <p>
          Designed by <a href="https://www.arimilli.io">Bharat Arimilli</a>.
          Thanks to <a href="https://garrettgu.com/">Garrett Gu</a>,{' '}
          <a href="https://jeffw.xyz/">Jeffrey Wang</a>,{' '}
          <a href="https://www.linkedin.com/in/josephwickline/">
            Joseph Wickline
          </a>{' '}
          and our{' '}
          <Popover content={donors}>
            <span style={{ textDecoration: 'underline' }}>donors</span>.
          </Popover>
        </p>
      </Footer>
    </Container>
  );
}

export default Core;
