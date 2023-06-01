/*
    Copyright (c) 2012, Armin Preiml
    
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted (subject to the limitations in the
    disclaimer below) provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the
      distribution.

    * Neither the name of the author nor the names of its
      contributors may be used to endorse or promote products derived
      from this software without specific prior written permission.

    NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE
    GRANTED BY THIS LICENSE.  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT
    HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
    WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
    MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
    CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
    SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
    BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
    WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
    OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN
    IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

#ifndef PCRIO_H
#define PCRIO_H

#include <stdint.h>
#include <stddef.h>

#include "pcrdef.h"

#define PCR_SUCCESS(x) (x == PCR_ERROR_NONE)
#define PCR_FAILURE(x) (x != PCR_ERROR_NONE)

#define PCR_RET_ERR_LANG_NOT_SET -2

enum pcr_error {
  PCR_ERROR_NONE = 0,
  PCR_ERROR_BAD_ALLOC = 1,
  PCR_ERROR_READ = 2,
  PCR_ERROR_WRITE = 3,
  PCR_ERROR_CORRUPT_FILE = 4,
  PCR_ERROR_INVALID_SIGNATURE = 5,
  PCR_ERROR_UNSUPPORTED = 6
};

typedef enum pcr_error pcr_error_code;

/**
 * Get a string describing the error. 
 */
extern const char* pcr_error_message(pcr_error_code err);

extern struct pcr_file *pcr_read_file(const char *filename, pcr_error_code *err);
extern void pcr_write_file(const char *filename, struct pcr_file *pfile, pcr_error_code *err);

extern void pcr_free(struct pcr_file *pfile);

/**
 * TODO better name 
 */
extern const struct language_info_array* pcr_get_language_info(const struct pcr_file *pfile);

/**
 * Get the default language. If there is only one language available on read, it will
 * be set as default. If not the language needs to be set using pcr_set_default_language.
 * 
 * @param pfile 
 * @return ptr to language struct or NULL if none is set
 */
extern const struct pcr_language * pcr_get_default_language(const struct pcr_file *pfile);

/**
 */
// extern void pcr_set_default_language(struct pcr_file* pf, uint32_t language_id);
/**
 */
// extern void pcr_set_default_languageL(struct pcr_file *pf, struct pcr_language lang);

/**
 * See pcr_get_codepageL.
 * 
 * @return (uint32_t)-2 if default language not set (PCR_RET_ERR_LANG_NOT_SET) 
 */
extern uint32_t pcr_get_codepage(const struct pcr_file *pf, uint32_t string_id);

/**
 * @return codepage if string, language dir or language is sane in lang_info_array.
 *         (uint32_t)-1 if not set.
 */
extern uint32_t pcr_get_codepageL(const struct pcr_file *pf, uint32_t string_id, uint32_t language_id);
  
/**
 * Returns the string length. 
 * 
 * @return Number of characters (without ending \0) or 0 if not found. 
 *         -2 if language id not set (PCR_RET_ERR_LANG_NOT_SET)
 */
extern int32_t pcr_get_strlen(const struct pcr_file *pf, uint32_t id);

/**
 * Method for getting the length of a string with language id as additional parameter.
 * 
 * @return Length of string (without ending \0) or 0 if not found.
 */
extern uint16_t pcr_get_strlenL(const struct pcr_file *pf, uint32_t id, uint32_t language_id);
    
/**
 * Copies n bytes of string with given id to dest. Is n > strlen, remaining bytes 
 * will be \0 padded. Warning: If there is no null byte among the first n bytes
 * of src, the string placed in dest will not be null-terminated.
 * 
 * @param n bytes to copy: 
 * 
 * @return >= 0 if successfull. 1 if codepage differs from default language (pcr_get_codepage).
 *         -2 if default language is not set (PCR_RET_ERR_LANG_NOT_SET) 
 */
extern int pcr_get_string(const struct pcr_file *pf, uint32_t id, char *dest, size_t n); 

/** 
 * See pcr_get_string. This function has the language_id as additional parameter.
 * 
 * @return >= 0 if successfull. 1 if codepage is not unique for language (pcr_get_codepage).
 */
extern int pcr_get_stringL(const struct pcr_file *pf, uint32_t id, uint32_t language_id, char *dest, size_t n);

/**
 * @return 0 on success.
 *         -1 if string can't be stored using lang.codepage (there is already a resource
 *         directory using a different codepage for language with given lang.id).
 *         >0 see pcr_error_code (Possible: BAD_ALLOC, UNSUPPORTED)
 */
extern int pcr_set_stringC(struct pcr_file *pf, uint32_t id, struct pcr_language lang, const char *src);

#endif // PCRIO_H
