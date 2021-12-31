import React from 'react'
import NextLink from 'next/link';
import {
    Link
  } from '@material-ui/core';

export default function verifyToken() {
    return (
        <div style={{width: '100%', height: '100vh',display:"grid",placeItems: 'center'}}>
            <h2>
            Check Your mail.
            <NextLink href="/login" passHref>
                <Link>Login.</Link>
            </NextLink>
            </h2>
        </div>
    )
}
