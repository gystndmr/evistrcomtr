<?php
require_once "Config.php";

function generateSignature(array $data): string
{
    $privateKey = openssl_pkey_get_private(PRIVATE_KEY);
    ksort($data, SORT_NATURAL);

    // Trim all string values in the data array recursively
    array_walk_recursive(
        $data,
        static function(&$field) {
            $field = trim($field);
        }
    );

    openssl_sign(json_encode($data), $signature,
        $privateKey, 'md5WithRSAEncryption'
    );

    return base64_encode($signature);
}

/**
 * @throws JsonException
 */
function verifySignature(array $data): bool
{
    $publicKey = openssl_pkey_get_public(PUBLIC_KEY);
        $dataWithoutSignature = array_filter($data, static function ($key) {
            return $key !== 'signature';
        }, ARRAY_FILTER_USE_KEY);

        $signature = $data['signature'] ?? null;
        if (empty($signature)) {
            return false;
        }

        ksort($dataWithoutSignature, SORT_NATURAL);
        array_walk_recursive(
            $dataWithoutSignature,
            static function(&$field) {
                $field = trim($field);
            }
        );

        $result = openssl_verify(
            json_encode($dataWithoutSignature, JSON_THROW_ON_ERROR),
            base64_decode($signature),
            $publicKey,
            'md5WithRSAEncryption'
        );


        return $result === 1;
}