/*
    Copyright (c) 2012, Armin Preiml
    
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted (subject to the limitations in the
    disclaimer below) provided that the following conditions are met:

    * Redistributions of source err must retain the above copyright
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

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "pcrio.h"

#define INT32_HIGH_BYTE 2147483648u

// TODO: is 16 const?
#define MAX_STRINGS_PER_LEAF 16

#define UNKNOWN_HEADER_SIZE 0x98
#define SUPPORTED_OPTIONAL_HEADER_SIZE 224

#define SECTION_NAME_RESOURCE ".rsrc"

#define IMAGE_SCN_CNT_INITIALIZED_DATA       0x00000040  // Section contains initialized data.


/*
 * Macros
 */
// Calc the id of the strings root node on name level.
#define RSRC_STRING_NAME_DIR_ID(string_id) (string_id/MAX_STRINGS_PER_LEAF + 1);
#define RSRC_STRING_DATA_OFFSET(string_id) string_id % MAX_STRINGS_PER_LEAF

enum rsrc_node_identifier {
  TREE_NODE_IDENTIFIER_ID = 0,
  TREE_NODE_IDENTIFIER_NAME = 1

};

struct rsrc_section_size { 
  uint32_t s_tree;
  uint32_t s_data_description;
  uint32_t s_directory_strings;
  uint32_t s_data;
  
  uint32_t section_start_pos;
  int32_t  raw_data_offset;
};

//TODO: iterator?
//TODO: IMAGE_SECTION_HEADER.name needs special treatment!

//TODO: documentation
//TODO: cleanup source err (variable name, coding style)


/* 
 * misc utils
 */

void * pcr_malloc(size_t size, enum pcr_error *err);
void * pcr_realloc(void *ptr, size_t size, enum pcr_error *err);
// void * pcr_reallocF(void *ptr, size_t size, enum pcr_error *err);

void pcr_fread(void *ptr, size_t size, size_t nmemb, FILE *stream, enum pcr_error *err);
void pcr_fwrite(const void*ptr, size_t size, size_t nmemb, FILE *stream, enum pcr_error *err);

void pcr_zero_pad(FILE *stream, uint32_t pos, enum pcr_error *err);

uint32_t pcr_align(uint32_t number, uint32_t align);

/*
 * compare functions
 */

int pcr_comp_image_secion_headers (const void *a, const void *b);
int pcr_comp_id_tree_nodes (const void *a, const void *b);
int pcr_comp_language_info (const void *a, const void *b);
int pcr_comp_language_info_without_cp (const void *a, const void *b);

/*
 * read functions
 */

void pcr_read_optional_header(struct pcr_file *pfile, FILE *file, pcr_error_code *err);
void pcr_read_section_table(struct pcr_file *pfile, FILE *file, pcr_error_code *err);
void pcr_read_section_data(struct pcr_file *pfile, FILE *file, pcr_error_code *err);
void pcr_read_rsrc_section(struct pcr_file *pcr_file, FILE *file, pcr_error_code *err);
 
struct resource_tree_node *pcr_read_rsrc_tree(FILE *file, enum pcr_error *err, 
      long section_offset, long raw_data_offset, int level, enum resource_type type, struct language_info_array *cult_info_arr);

struct resource_tree_node * pcr_read_sub_tree(FILE *file, enum pcr_error *err, long section_offset, long raw_data_offset,
                  struct resource_directory_entry *directory_entry, 
                  enum rsrc_node_identifier identified_by, int level, enum resource_type type, struct language_info_array *cult_info_arr);              

struct resource_directory_entry * pcr_read_rsrc_directory_entries(FILE *file, int count, 
                                    enum pcr_error *err);

struct resource_data* pcr_read_rsrc_data(FILE *file, enum pcr_error *err, uint32_t size, 
                                         enum resource_type type);

char *pcr_read_string(FILE *file, enum pcr_error *err);

/*
 * pre write functions
 */

struct rsrc_section_size pcr_prepare_rsrc_data(struct pcr_file *pcr_file, enum pcr_error *err_code);
void pcr_prepare_rsrc_node(struct resource_tree_node *node, 
                               enum pcr_error *err_code, struct rsrc_section_size *size);

/*
 * write functions
 */

void pcr_write_section_data(struct pcr_file *pcr_file, FILE *stream, 
                          enum pcr_error *err, struct rsrc_section_size size);

void pcr_write_rsrc_section(struct pcr_file *pcr_file, FILE *stream, 
                          enum pcr_error *err, struct rsrc_section_size size);

void pcr_write_rsrc_node(struct resource_tree_node *node, FILE *stream, 
                          enum pcr_error *err_code, struct rsrc_section_size size);

void pcr_write_data_description(struct resource_tree_node *node, FILE *stream, 
                          enum pcr_error *err_code, struct rsrc_section_size size);

void pcr_write_directory_strings(struct resource_tree_node *node, FILE *stream, 
                          enum pcr_error *err_code, struct rsrc_section_size size);

void pcr_write_rsrc_section_data(struct resource_tree_node *node, FILE *stream, 
                          enum pcr_error *err_code, struct rsrc_section_size size);


void pcr_write_string(char *str, FILE *stream, enum pcr_error *err_code);
void pcr_write_rsrc_data(struct resource_data *str, FILE *stream, enum pcr_error *err_code);

/*
 * initialization functions
 */

struct resource_tree_node * pcr_create_rsrc_tree_node(pcr_error_code *err);
struct resource_data *pcr_create_rsrc_data(struct pcr_language lang, pcr_error_code *err);

/*
 * free
 */

void pcr_free_resource_tree_node(struct resource_tree_node *node);
void pcr_free_resource_data(struct resource_data *resource_data);

/*
 * access functions
 */

void pcr_add_rsrc_node(struct resource_tree_node *root, struct resource_tree_node *child, pcr_error_code *err);
void pcr_update_language_info(struct language_info_array *lang_info_array, uint32_t language_id, uint32_t codepage, pcr_error_code *err);
unsigned int pcr_get_language_count(const struct pcr_file *pf, uint32_t language_id);
// only works if language count == 1, else (or if not found) NULL
const struct pcr_language * pcr_get_language(const struct pcr_file *pf, uint32_t language_id); 
struct image_section_header * pcr_get_section_header(struct pcr_file *pfile, const char *name);
struct resource_tree_node* pcr_get_sub_id_node(const struct resource_tree_node *node, uint32_t id);

struct rsrc_string_ptr pcr_get_string_ptr (const struct pcr_file *pf, uint32_t id, uint32_t language_id);

/*
 * misc utils
 */

/**
 */
const char* pcr_error_message(pcr_error_code err)
{
  switch(err)
  {
    case PCR_ERROR_NONE: return "Success"; break;
    case PCR_ERROR_BAD_ALLOC: return "Bad alloc!"; break;
    case PCR_ERROR_READ: return "Unable to read file"; break;
    case PCR_ERROR_WRITE: return "Unable to write file"; break;
    case PCR_ERROR_CORRUPT_FILE: return "Corrupt file"; break;
    case PCR_ERROR_INVALID_SIGNATURE: 
      return "Invalid signature (corrupt file?)"; break;
    case PCR_ERROR_UNSUPPORTED: 
      return "Unsupported file (missing functionality)"; break;
    default:
      return "No error message. Did you initialize the error?"; break;
  }
}

/**
 * "safe" malloc with error handling. Allocation will be skipped if 
 *  error err != NONE
 */
void * pcr_malloc(size_t size, enum pcr_error *err)
{
  void *alloc_var = NULL;
  
  if (*err == PCR_ERROR_NONE && size > 0)
  {
    alloc_var = malloc(size);
    
    if (alloc_var == NULL)
      *err = PCR_ERROR_BAD_ALLOC;
  }
  
  return alloc_var;
}

/**
 * "safe" realloc with error handling. *ptr will not be freed on error!
 */
void * pcr_realloc(void *ptr, size_t size, enum pcr_error *err)
{
  void *new_alloc = NULL;

  if (*err == PCR_ERROR_NONE)
  {
    new_alloc = realloc(ptr, size);

    if (new_alloc == NULL)
      *err = PCR_ERROR_BAD_ALLOC;
  }

  return new_alloc;
}

/**
 * *ptr WILL be freed on error, but will NOT be set to NULL TODO
 */
/*
void * pcr_reallocF(void *ptr, size_t size, enum pcr_error *err)
{
  void *new_alloc = NULL;
  
  if (*err != PCR_ERROR_NONE)
    return NULL;
  
  new_alloc = realloc(ptr, size);
  
  if (new_alloc == NULL)
  {
    free(ptr);
    
    *err = PCR_ERROR_BAD_ALLOC;
  }
  
  return new_alloc;
}
*/
  
/**
 * fread with enum pcr_error checking
 */
void pcr_fread(void *ptr, size_t size, size_t nmemb, FILE *stream, 
               enum pcr_error *err)
{
  if (*err == PCR_ERROR_NONE)
  {
    if (fread(ptr, size, nmemb, stream) < nmemb)
      *err = PCR_ERROR_READ;
  }
}

/**
 * fwrite with enum pcr_error checking
 */
void pcr_fwrite(const void*ptr, size_t size, size_t nmemb, FILE *stream,
                enum pcr_error *err)
{
  if (*err == PCR_ERROR_NONE)
  {
    if (fwrite(ptr, size, nmemb, stream) < nmemb)
      *err = PCR_ERROR_WRITE;
  }
}

/**
 * Fills 0 until pos.
 */
void pcr_zero_pad(FILE *stream, uint32_t pos, enum pcr_error *err)
{
  char empty = 0;
  long lpos = pos;
  
  while (ftell(stream) >= 0 && ftell(stream) < lpos)
     pcr_fwrite(&empty, 1, 1, stream, err);
  
  if (ftell(stream) == -1)
    *err = PCR_ERROR_WRITE;
}

/**
 * Align an unsigned int
 */
uint32_t pcr_align(uint32_t number, uint32_t align)
{
  if (number % align != 0)
    number += align - (number % align);
  
  return number;
}

/*
 * compare functions
 */

/**
 * Compare function to sort section headers ascending by pointer_to_raw_data.
 */
int pcr_comp_image_secion_headers (const void *a, const void *b)
{
  return ((struct image_section_header *)a)->pointer_to_raw_data -
         ((struct image_section_header *)b)->pointer_to_raw_data; 
}

/**
 * Compare function that compares the id of Tree nodes
 */
int pcr_comp_id_tree_nodes (const void *a, const void *b)
{
  return (*(struct resource_tree_node **)a)->id - 
         (*(struct resource_tree_node **)b)->id;
}

int pcr_comp_name_tree_nodes (const void *a, const void *b)
{
  return strcmp((*(struct resource_tree_node **)a)->name, 
                (*(struct resource_tree_node **)b)->name); 
}

int pcr_comp_language_info (const void *a, const void *b)
{
  int id_diff = ((struct language_info *)a)->lang.id -
                ((struct language_info *)b)->lang.id; 
  
  if (id_diff == 0)
    return ((struct language_info *)a)->lang.codepage -
           ((struct language_info *)b)->lang.codepage; 
  else
    return id_diff;
}

int pcr_comp_language_info_without_cp (const void *a, const void *b)
{
  return ((struct language_info *)a)->lang.id -
         ((struct language_info *)b)->lang.id; 
}
/*
 * read functions
 */

/**
 * 
 */
struct pcr_file *pcr_read_file(const char *filename, pcr_error_code *err)
{
  FILE *file = NULL;
  struct pcr_file *pfile = NULL;
  unsigned int rm_stub_size;  

  if (PCR_FAILURE(*err))
    return NULL;
  
  file = fopen(filename, "rb");
  
  if (file == NULL)
    *err = PCR_ERROR_READ;
  else
  {
    pfile = (struct pcr_file *) pcr_malloc(sizeof(struct pcr_file), err);
    
    pfile->rm_stub = NULL;
    pfile->image_optional_header32 = NULL;
    pfile->section_table = NULL;
    pfile->rsrc_section_data = NULL;
    pfile->section_data = NULL;

    pcr_fread(&pfile->dos_header, sizeof(struct image_dos_header), 1, file, err);
    
    rm_stub_size = pfile->dos_header.e_lfanew - sizeof(struct image_dos_header);
    pfile->rm_stub = (char *)pcr_malloc(rm_stub_size, err);
    
    pcr_fread(pfile->rm_stub, rm_stub_size, 1, file, err);    
    pcr_fread(pfile->signature, sizeof(char), 4, file, err);
    pcr_fread(&pfile->image_file_header, sizeof(struct image_file_header), 1, file, err);
    
    pcr_read_optional_header(pfile, file, err);
    pcr_read_section_table(pfile, file, err);
    
    pcr_read_section_data(pfile, file, err);
    
    fclose(file);
  }
  
  return pfile;
}

/**
 * Allocate and read optional header if available
 */
void pcr_read_optional_header(struct pcr_file *pfile, FILE *file, pcr_error_code *err)
{ 
  uint16_t magic = 0;
  
  if (*err== PCR_ERROR_NONE && pfile->image_file_header.size_of_optional_header > 0)
  {
    if (pfile->image_file_header.size_of_optional_header !=  SUPPORTED_OPTIONAL_HEADER_SIZE)
    {
      *err= PCR_ERROR_UNSUPPORTED;
      return;
    }
    
    pcr_fread(&magic, sizeof(uint16_t), 1, file, err);
    
    if (magic != IMAGE_OPTIONAL_HDR32_MAGIC)
      *err= PCR_ERROR_UNSUPPORTED;
    else
    {
      pfile->image_optional_header32 = (struct image_optional_header32 *)
          pcr_malloc(sizeof(struct image_optional_header32), err);
        
      if (*err== PCR_ERROR_NONE)
      {
        struct image_optional_header32 *opt_header = pfile->image_optional_header32;
        
        opt_header->magic = magic;
        
        // skipping magic on read
        pcr_fread(&opt_header->major_linker_version, 
                  sizeof(struct image_optional_header32) - sizeof(magic), 1, file, err);
      }
            
    }
  }
}

/**
 * Read and sort section table
 */
void pcr_read_section_table(struct pcr_file *pfile, FILE *file, pcr_error_code *err)
{
  if (PCR_FAILURE(*err))
    return;
  
  uint16_t num_sec = pfile->image_file_header.number_of_sections;
        
  pfile->section_table = (struct image_section_header *)pcr_malloc(sizeof(struct image_section_header) * num_sec, err);
  pcr_fread(pfile->section_table, sizeof(struct image_section_header), num_sec, file, err);
  
  qsort(pfile->section_table, num_sec, sizeof(struct image_section_header),  
        pcr_comp_image_secion_headers);
}

/**
 * 
 */
void pcr_read_section_data(struct pcr_file *pfile, FILE *stream, pcr_error_code *err)
{
  if (PCR_FAILURE(*err))
    return;
  
  int num_sec, i; 
  
  num_sec = pfile->image_file_header.number_of_sections;
  
  pfile->section_data = (char **)pcr_malloc(sizeof(char *) * num_sec, err);
  
  for (i=0; i<num_sec && PCR_SUCCESS(*err); i++)
  {
    struct image_section_header *sec = &pfile->section_table[i];
    
    fseek(stream, sec->pointer_to_raw_data, SEEK_SET);
    
    if (strcmp(SECTION_NAME_RESOURCE, sec->name) == 0)
    {
      pfile->section_data[i] = NULL;
            
      pcr_read_rsrc_section(pfile, stream, err);
    }
    else
    { 
      pfile->section_data[i] = (char *)pcr_malloc(sec->virtual_size, err);
        
      pcr_fread(pfile->section_data[i], sec->virtual_size, 1, stream, err);
    }
  }
  
}

/**
 * 
 */
void pcr_read_rsrc_section(struct pcr_file *pfile, FILE *file, pcr_error_code *err)
{
  pfile->rsrc_section_data = NULL;
 
  if (PCR_FAILURE(*err))
    return;

  struct image_section_header *rsrc_header;
  
  rsrc_header = pcr_get_section_header(pfile, SECTION_NAME_RESOURCE);
    
  if (rsrc_header != NULL)
  {
    struct language_info_array *lang_info = NULL;

    pfile->rsrc_section_data = (struct resource_section_data *)pcr_malloc(sizeof(struct resource_section_data), err);
    pfile->rsrc_section_data->rsrc_string_cache.sptr = NULL;
    
    lang_info = &pfile->rsrc_section_data->language_info;

    lang_info->array = NULL;
    lang_info->count = 0;
    pfile->rsrc_section_data->default_language = NULL;
  
    long raw_data_offset = (long)rsrc_header->pointer_to_raw_data - rsrc_header->virtual_adress;
      
    pfile->rsrc_section_data->root_node = 
      pcr_read_rsrc_tree(file, err, ftell(file), raw_data_offset, 0, RESOURCE_TYPE_UNKNOWN, lang_info); 

    if (lang_info->count == 1)
    {
      printf("Setting default culture to %d\n", lang_info->array[0].lang.id);

      pfile->rsrc_section_data->default_language = &lang_info->array[0].lang;
    }

  }
}

/**
 * reas a directory table and recoursivly reads its children
 */
struct resource_tree_node * pcr_read_rsrc_tree(FILE *file, pcr_error_code *err_code, 
                       long section_offset, long raw_data_offset, int level, enum resource_type type, struct language_info_array *cult_info_arr)
{
  if (*err_code != PCR_ERROR_NONE)
    return NULL;
  
  struct resource_tree_node *node = NULL;  

  node = pcr_create_rsrc_tree_node(err_code);
 
  if (node != NULL)
  {
    uint16_t num_id_entries, num_name_entries;
    struct resource_directory_entry *name_entries, *id_entries;
    
    pcr_fread(&node->directory_table, sizeof(struct resource_directory_table), 1, file, err_code);

    num_id_entries = node->directory_table.number_of_id_entries;
    num_name_entries = node->directory_table.number_of_name_entries;
  
    name_entries = pcr_read_rsrc_directory_entries(file, num_name_entries, err_code);
    id_entries = pcr_read_rsrc_directory_entries(file, num_id_entries, err_code);
  
    node->name_entries = (struct resource_tree_node **)pcr_malloc(sizeof(struct resource_tree_node *) * num_name_entries, err_code);
    node->id_entries = (struct resource_tree_node **)pcr_malloc(sizeof(struct resource_tree_node *) * num_id_entries, err_code);
    
    if (*err_code != PCR_ERROR_NONE)
    {
      free(node->name_entries);
      free(node->id_entries);
      free(name_entries);
      free(id_entries);
      free(node);
      return NULL;
    }
    
    int i;
    for (i=0; i < num_name_entries; i++)
      node->name_entries[i] = pcr_read_sub_tree(file, err_code, section_offset, raw_data_offset, &name_entries[i], 
                                                TREE_NODE_IDENTIFIER_NAME, level, type, cult_info_arr);
  
    for (i=0; i < num_id_entries; i++)
      node->id_entries[i] = pcr_read_sub_tree(file, err_code, section_offset, raw_data_offset, &id_entries[i], 
                                              TREE_NODE_IDENTIFIER_ID, level, type, cult_info_arr);
  
    free(name_entries);
    free(id_entries);
  }
  
  return node;
}


/**
 * Reads a node using data from givne directory_entry and recursivly loads 
 * subdirectories or leaf data.
 */
struct resource_tree_node * 
pcr_read_sub_tree(FILE *file, enum pcr_error *err_code, long section_offset, long raw_data_offset,
                  struct resource_directory_entry *directory_entry, 
                  enum rsrc_node_identifier identified_by, int level, enum resource_type type, struct language_info_array *cult_info_arr)
{
  if (*err_code != PCR_ERROR_NONE)
    return NULL;
   
  struct resource_tree_node *subtree = NULL;
  uint32_t rva_child;
  
  level ++;
  
  if (level == 1 && directory_entry->id == RESOURCE_TYPE_STRINGS)
    type = RESOURCE_TYPE_STRINGS;
  
  rva_child = directory_entry->rva;
    
  if (rva_child & INT32_HIGH_BYTE)    // node is a subdirectory
  {
    rva_child = rva_child - INT32_HIGH_BYTE;
    
    fseek(file, section_offset + rva_child, SEEK_SET);
    
    subtree = pcr_read_rsrc_tree(file, err_code, section_offset, raw_data_offset, level, type, cult_info_arr);
    
  }
  else // node contains data (leaf)
  {
    struct resource_data_entry data_entry;
    struct resource_data* data = NULL;
    long data_offset;
    
    fseek(file, section_offset + rva_child, SEEK_SET);
    
//     printf("Read data_entry at :%d\n" ,section_offset + rva_child);
    
    pcr_fread(&data_entry, sizeof(struct resource_data_entry), 1, file, err_code);
    
    data_offset = data_entry.data_rva + raw_data_offset ;
    fseek(file, data_offset, SEEK_SET); 
//     printf("Read data at: %d, size: %d\n", data_offset, data_entry.size);
    
    data = pcr_read_rsrc_data(file, err_code, data_entry.size, type);
    
    if (data != NULL)
    {
      data->data_entry = data_entry;
      
      pcr_update_language_info(cult_info_arr, directory_entry->id, data_entry.codepage, err_code);
    }
    
    subtree = pcr_create_rsrc_tree_node(err_code); 

    if (subtree)
      subtree->resource_data = data;
  }
    
  // node identification:
  
  if (subtree != NULL)
  {
    if (identified_by == TREE_NODE_IDENTIFIER_NAME)
    {
      long name_rva = directory_entry->id - INT32_HIGH_BYTE;
      name_rva += section_offset;
      
      fseek(file, name_rva, SEEK_SET);
      
      subtree->name = pcr_read_string(file, err_code);
    }
    else if (identified_by == TREE_NODE_IDENTIFIER_ID) 
    {
      subtree->id = directory_entry->id;
    }
    
    subtree->directory_entry = *directory_entry;
  }
  
  return subtree;
}

/**
 * Reads an array of directory entries.
 */
struct resource_directory_entry * pcr_read_rsrc_directory_entries(FILE *file, int count, 
                                    enum pcr_error *err_code)
{
  if (*err_code != PCR_ERROR_NONE || count <= 0)
    return NULL;
  
  struct resource_directory_entry *entries = NULL;
  
  entries = (struct resource_directory_entry *)
      pcr_malloc(sizeof(struct resource_directory_entry) * count, err_code);
  pcr_fread(entries, sizeof(struct resource_directory_entry), count, file, err_code);
  
  return entries;
}

/**
 * read either a string or raw data from file
 */
struct resource_data *pcr_read_rsrc_data(FILE *file, enum pcr_error *err_code, 
                                   uint32_t size, enum resource_type type)
{
  struct resource_data *data = NULL;
    
  if (size > 0 && *err_code == PCR_ERROR_NONE)
  {
    char *raw_data = NULL;
    char **strings = NULL;
    uint16_t string_count = 0; 
    int i;
    
    if (type == RESOURCE_TYPE_STRINGS)
    {
      // placeholder for realloc error handling
      char **re_strings = NULL; 
      
      uint32_t area_start_pos = ftell(file);
      
      while (uint32_t(ftell(file)) < (area_start_pos + size))
      {
        re_strings = (char **)pcr_realloc(strings, sizeof(char *) * (string_count+1), err_code); 
          
        if (*err_code != PCR_ERROR_NONE)
          break;

        strings = re_strings;
          
        strings[string_count] = pcr_read_string(file, err_code);
        
        string_count++;
      }
      
      if (*err_code != PCR_ERROR_NONE)
      {
        for (i=0; i<string_count; i++)
          free(strings[i]);
          
        free(strings);
      }
    }
    else // other types
    {
      raw_data = (char*)pcr_malloc(size, err_code);
      pcr_fread(raw_data, size, 1, file, err_code);
    }
    
    data = (struct resource_data *)pcr_malloc(sizeof(struct resource_data), err_code);
   
    if (data != NULL)
    {
      data->strings = strings;
      data->number_of_strings = string_count;
      data->raw_data = raw_data;
      data->type = type;
    }
  }
  
  return data;
}

/**
 * Reads a single string from stream. Strings are stored word aligned. 
 * Read strings are finished with \0.
 */
char *pcr_read_string(FILE *file, enum pcr_error *err_code)
{
  char *string;
  uint16_t size;
  
  pcr_fread(&size, sizeof(uint16_t), 1, file, err_code);
  string = (char *)pcr_malloc(sizeof(char) * (size+1), err_code);
      
  if (*err_code == PCR_ERROR_NONE)
  {
    int i;
    
    for (i=0; i<size; i++)
    {
      pcr_fread((string + i), sizeof(char), 1, file, err_code);
      
      // skip 1 byte because strings are stored word aligned
      fseek(file, 1, SEEK_CUR);
    }
        
    string[size] = '\0';
  }
  
  return string;
}

/*
 * pre write functions
 */

/**
 * Calculates sizes and updates rvas. Data and name rvas will be relative.
 * They have to be updated on write.
 */
struct rsrc_section_size pcr_prepare_rsrc_data(struct pcr_file *pcr_file, enum pcr_error *err_code)
{
  struct rsrc_section_size rs_size;
  struct image_section_header *rsrc_header;
  
  rs_size.s_tree = 0;
  rs_size.s_data_description = 0;
  rs_size.s_directory_strings = 0;
  rs_size.s_data = 0;
  rs_size.section_start_pos = 0;
  rs_size.raw_data_offset = 0;
  
  if (*err_code == PCR_ERROR_NONE)
  {
    rsrc_header = pcr_get_section_header(pcr_file, SECTION_NAME_RESOURCE);
    
    if (rsrc_header)
    {
      rs_size.section_start_pos = rsrc_header->pointer_to_raw_data;
      
      rs_size.raw_data_offset = (long)rsrc_header->pointer_to_raw_data - rsrc_header->virtual_adress;
      
      pcr_prepare_rsrc_node(pcr_file->rsrc_section_data->root_node, err_code, &rs_size);
    }
    else
    {
      printf("Debug: Prepare: No resource section header!\n");
      *err_code = PCR_ERROR_UNSUPPORTED;
    }
  
  }
  
  return rs_size;
}

/**
 * recursivly update rvas and sizes
 */
void pcr_prepare_rsrc_node(struct resource_tree_node *node, enum pcr_error *err_code, 
                           struct rsrc_section_size *size)
{
  int i = 0;
    
  if (node->name == NULL)
  {
    node->directory_entry.id = node->id;
  }
  else
  {
    node->directory_entry.id = size->s_directory_strings; 
    
    size->s_directory_strings += strlen(node->name) * 2 + sizeof(uint16_t);
  }
  
  if (node->resource_data == NULL) // node
  {
    
    node->directory_entry.rva = INT32_HIGH_BYTE | size->s_tree;
    
    uint32_t rva_next_node = 0;
    rva_next_node += node->directory_table.number_of_id_entries;
    rva_next_node += node->directory_table.number_of_name_entries;
    rva_next_node *= sizeof(struct resource_directory_entry);
    rva_next_node += sizeof(struct resource_directory_table);
        
    size->s_tree += rva_next_node;
    
    for (i=0; i<node->directory_table.number_of_name_entries; i++)
      pcr_prepare_rsrc_node(node->name_entries[i], err_code, size); 
    
    for (i=0; i<node->directory_table.number_of_id_entries; i++)
      pcr_prepare_rsrc_node(node->id_entries[i], err_code, size);
  }
  else // leaf
  {
    node->directory_entry.rva = size->s_data_description;
    
    size->s_data_description += sizeof(struct resource_data_entry);
    
    if (node->resource_data->type == RESOURCE_TYPE_STRINGS)
    {
      uint32_t act_size = 0;
      for(i=0; i<node->resource_data->number_of_strings; i++)
      {
        act_size += strlen(node->resource_data->strings[i]) *2;
        act_size += 2;
      }
        
      if (act_size != node->resource_data->data_entry.size)
      {
        printf("Warning: Wrong string size %d act %d (Word aligned?)\n", 
               node->resource_data->data_entry.size, act_size);
        
        node->resource_data->data_entry.size = act_size;
      }
    }
    
    node->resource_data->data_entry.data_rva = size->s_data;
    size->s_data += node->resource_data->data_entry.size;
  }
}

/**
 * updates section adress and sizes
 */
void pcr_update_section_table(struct pcr_file *pfile, struct rsrc_section_size rs_size)
{
  uint32_t i, virtual_rsrc_size, raw_rsrc_size, file_align, sec_align;
  int32_t raw_diff, virt_diff;
  struct image_section_header *rsrc_sh;
  
  rsrc_sh = pcr_get_section_header(pfile, SECTION_NAME_RESOURCE);
  
  // virtual resource size is the actual size
  virtual_rsrc_size = rs_size.s_data + rs_size.s_data_description +
                      rs_size.s_directory_strings + rs_size.s_tree;
                      
  file_align = pfile->image_optional_header32->file_alignment;
  sec_align = pfile->image_optional_header32->section_alignment;
  
  raw_rsrc_size = pcr_align(virtual_rsrc_size, file_align);
  
  printf("Old virt size: 0x%x, raw size: 0x%x\n", rsrc_sh->virtual_size, rsrc_sh->size_of_raw_data); 
  printf("\nVirtual size: 0x%x\nRaw Size: 0x%x\n", virtual_rsrc_size, raw_rsrc_size);
  
  
  raw_diff = (int32_t)raw_rsrc_size - rsrc_sh->size_of_raw_data;
  
  virt_diff = (int32_t)pcr_align(virtual_rsrc_size, sec_align) - pcr_align(rsrc_sh->virtual_size, sec_align);
  
  printf("New virt (aligned): %d, Old virt (aligned): %d\n", pcr_align(virtual_rsrc_size, sec_align), pcr_align(rsrc_sh->virtual_size, sec_align));
  
  printf("Raw diff: %d\n", raw_diff);
  printf("TODO: Virt diff: %d, sec_align: %d\n", virt_diff, sec_align);
  
  rsrc_sh->virtual_size = virtual_rsrc_size;

  if (raw_diff != 0 || virt_diff != 0)
  {
    uint16_t num_sec;
    uint32_t size_of_initialized_data = 0;
  
    rsrc_sh->size_of_raw_data = raw_rsrc_size;
    
    num_sec = pfile->image_file_header.number_of_sections;
  
    // update section table
    for (i=0; i<num_sec; i++)
    {
      struct image_section_header *sec = &pfile->section_table[i];
    
      if (strcmp(SECTION_NAME_RESOURCE, sec->name) != 0)
      {
        if (sec->pointer_to_raw_data > rsrc_sh->pointer_to_raw_data)
          sec->pointer_to_raw_data += raw_diff;
        
        if (sec->virtual_adress > rsrc_sh->virtual_adress)
          sec->virtual_adress += virt_diff;
      }
      
      if ((sec->characteristics & IMAGE_SCN_CNT_INITIALIZED_DATA) == IMAGE_SCN_CNT_INITIALIZED_DATA)
      {
        size_of_initialized_data += sec->size_of_raw_data;
      }
    }
    
    printf("Debug: Size of initialized data: %d\n", size_of_initialized_data);
    
    // update header TODO move to an extra function
    pfile->image_optional_header32->size_of_initialized_data = size_of_initialized_data;
    pfile->image_optional_header32->size_of_image += raw_diff;
    
    // update data directory
    pfile->image_optional_header32->data_directory[DATA_DIRECTORY_ID_RESOURCE].size = virtual_rsrc_size;
    
    for (i=0; i<DATA_DIRECTORY_COUNT; i++)
    {
      struct image_data_directory *dir = &pfile->image_optional_header32->data_directory[i];
      
      if (dir->rva > pfile->image_optional_header32->data_directory[DATA_DIRECTORY_ID_RESOURCE].rva)
      {
        dir->rva += virt_diff;
      }
    }
  }
}

/*
 * Write functions
 */

/**
 * 
 */
void pcr_write_file(const char *filename, struct pcr_file *pfile, pcr_error_code *err)
{
  FILE *stream = NULL;
  
  if (pfile == NULL || PCR_FAILURE(*err))
    return;
  
  stream = fopen(filename, "wb");
  
  if (stream == NULL)
    *err = PCR_ERROR_WRITE;
  else
  {
    struct rsrc_section_size rs_size;
    rs_size = pcr_prepare_rsrc_data(pfile, err);
    
    pcr_update_section_table(pfile, rs_size);
    
    pcr_fwrite(&pfile->dos_header, sizeof(struct image_dos_header), 1, stream, err);
    
    unsigned int rm_stub_size = pfile->dos_header.e_lfanew - sizeof(struct image_dos_header);
    
    pcr_fwrite(pfile->rm_stub, rm_stub_size, 1, stream, err);
    pcr_fwrite(pfile->signature, sizeof(char), 4, stream, err); 
    pcr_fwrite(&pfile->image_file_header, sizeof(struct image_file_header), 1, stream, err);
    
    if (pfile->image_optional_header32 != NULL)
      pcr_fwrite(pfile->image_optional_header32, sizeof(struct image_optional_header32), 1, stream, err);
    
    pcr_fwrite(pfile->section_table, sizeof(struct image_section_header),
                pfile->image_file_header.number_of_sections, stream, err);
      
    pcr_write_section_data(pfile, stream, err, rs_size);
    
    fclose(stream);
  }
  
}

/**
 * 
 */
void pcr_write_section_data(struct pcr_file *pcr_file, FILE *stream, 
                            enum pcr_error *err_code, struct rsrc_section_size size)
{ 
  uint16_t i,num_sec;
  struct image_section_header *sec = NULL;
  
  if (*err_code != PCR_ERROR_NONE ||  pcr_file->image_optional_header32 == NULL)
    return;
  
  num_sec = pcr_file->image_file_header.number_of_sections;
  
  for (i=0; i<num_sec; i++)
  {
    sec = &pcr_file->section_table[i];
    
    pcr_zero_pad(stream, sec->pointer_to_raw_data, err_code);
    
    // TODO Debug only!
    if ((long int)sec->pointer_to_raw_data != ftell(stream))
      printf("Error: Section pointer differs from stream pos!\n");
    
    if (strcmp(SECTION_NAME_RESOURCE, sec->name) == 0)
      pcr_write_rsrc_section(pcr_file, stream, err_code, size);
    else
      pcr_fwrite(pcr_file->section_data[i], sec->size_of_raw_data, 1, stream, err_code);
  }
  
  // fill up until size of last section
  pcr_zero_pad(stream, sec->pointer_to_raw_data + sec->size_of_raw_data, err_code);
}

/**
 * 
 */
void pcr_write_rsrc_section(struct pcr_file *pcr_file, FILE *stream,
                            enum pcr_error *err_code, struct rsrc_section_size size)
{
  // write resource tree
  pcr_write_rsrc_node(pcr_file->rsrc_section_data->root_node, stream, err_code, size);
  pcr_write_data_description(pcr_file->rsrc_section_data->root_node, stream, err_code, size);
  pcr_write_directory_strings(pcr_file->rsrc_section_data->root_node, stream, err_code, size);
  pcr_write_rsrc_section_data(pcr_file->rsrc_section_data->root_node, stream, err_code, size);
  
}

/**
 * 
 */
void pcr_write_rsrc_node(struct resource_tree_node *node, FILE *stream, enum pcr_error *err_code, 
                         struct rsrc_section_size size)
{
  int i=0;
  
  if (node->resource_data != NULL)
    return;
  
  pcr_fwrite(&node->directory_table, sizeof(struct resource_directory_table), 1, stream, err_code);
  
  // write directory entries
  
  for (i=0; i<node->directory_table.number_of_name_entries; i++)
  {
    struct resource_tree_node *subnode = node->name_entries[i];
    
    // update name adress
    subnode->directory_entry.id += size.s_tree + size.s_data_description;
    subnode->directory_entry.id |= INT32_HIGH_BYTE;
    
    if (subnode->resource_data != NULL)
      subnode->directory_entry.rva += size.s_tree;
    
    pcr_fwrite(&subnode->directory_entry, sizeof(struct resource_directory_entry), 1, stream, err_code);
  }
    
  for (i=0; i<node->directory_table.number_of_id_entries; i++)
  {
    struct resource_tree_node *subnode = node->id_entries[i];
    
    if (subnode->resource_data != NULL)
      subnode->directory_entry.rva += size.s_tree;
    
    pcr_fwrite(&subnode->directory_entry, sizeof(struct resource_directory_entry), 1, stream, err_code);
  }
   
  // write subnodes
   
  for (i=0; i<node->directory_table.number_of_name_entries; i++)
    pcr_write_rsrc_node(node->name_entries[i], stream, err_code, size);
    
  for (i=0; i<node->directory_table.number_of_id_entries; i++)
    pcr_write_rsrc_node(node->id_entries[i], stream, err_code, size);
}

/**
 * recoursivly iterates the tree and writes data descriptions to the file
 */
void pcr_write_data_description(struct resource_tree_node *node, FILE *stream, enum pcr_error *err_code, 
                                struct rsrc_section_size size)
{
  if (node->resource_data != NULL) // write data description
  {
    struct resource_data_entry *entry = &node->resource_data->data_entry;
    
    entry->data_rva += size.section_start_pos + size.s_tree + size.s_data_description + size.s_directory_strings - size.raw_data_offset;
    
    pcr_fwrite(entry, sizeof(struct resource_data_entry), 1, stream, err_code);
  }
  else // go down if possible
  {
    int i=0;
    
    for (i=0; i<node->directory_table.number_of_name_entries; i++)
      pcr_write_data_description(node->name_entries[i], stream, err_code, size);
    
    for (i=0; i<node->directory_table.number_of_id_entries; i++)
      pcr_write_data_description(node->id_entries[i], stream, err_code, size);
  }
}

/**
 * writes node name identifiers
 */
void pcr_write_directory_strings(struct resource_tree_node *node, FILE *stream, enum pcr_error *err_code, 
                                 struct rsrc_section_size size)
{
  if (node->name != NULL)
  {
    pcr_write_string(node->name, stream, err_code);
  }
  
  int i=0;
  
  for (i=0; i<node->directory_table.number_of_name_entries; i++)
    pcr_write_directory_strings(node->name_entries[i], stream, err_code, size);
    
  for (i=0; i<node->directory_table.number_of_id_entries; i++)
    pcr_write_directory_strings(node->id_entries[i], stream, err_code, size);
}

/**
 * 
 */
void pcr_write_rsrc_section_data(struct resource_tree_node *node, FILE *stream, enum pcr_error *err_code, struct rsrc_section_size size)
{
  if (node->resource_data != NULL)
  {
    pcr_write_rsrc_data(node->resource_data, stream, err_code);
  }
  
  int i=0;
  for (i=0; i<node->directory_table.number_of_name_entries; i++)
    pcr_write_rsrc_section_data(node->name_entries[i], stream, err_code, size);
    
  for (i=0; i<node->directory_table.number_of_id_entries; i++)
    pcr_write_rsrc_section_data(node->id_entries[i], stream, err_code, size);
}

/**
 * 
 */
void pcr_write_rsrc_data(struct resource_data *str, FILE *stream, enum pcr_error *err_code)
{
  if (str != NULL)
  {
    if (str->type == RESOURCE_TYPE_STRINGS)
    {
      int i;
      for (i=0; i<str->number_of_strings; i++)
        pcr_write_string(str->strings[i], stream, err_code);
    }
    else
    {
      pcr_fwrite(str->raw_data, str->data_entry.size, 1, stream, err_code);
    }
  }
}

/**
 * 
 */
void pcr_write_string(char *str, FILE *stream, enum pcr_error *err_code)
{
  int i;
  char null = 0;
  uint16_t size = strlen(str);
  
  pcr_fwrite(&size, sizeof(uint16_t), 1, stream, err_code);
  
  for (i=0; i<size; i++)
  {
    pcr_fwrite(&str[i], sizeof(char), 1, stream, err_code);
    pcr_fwrite(&null, sizeof(char), 1, stream, err_code);
  }
}

/*
 * initialization functions
 */

/**
 * 
 */
struct resource_tree_node * pcr_create_rsrc_tree_node(pcr_error_code *err)
{
  struct resource_tree_node *node;
  size_t node_size = sizeof(struct resource_tree_node);
  
  node = (struct resource_tree_node *)pcr_malloc(node_size, err);
  
  memset(node, 0, node_size);
  
  return node;
}

struct resource_data *pcr_create_rsrc_data(struct pcr_language lang, pcr_error_code *err)
{
  int i, j;
  struct resource_data *resource_data;
  
  resource_data = (struct resource_data *)pcr_malloc(sizeof(struct resource_data), err);
  
  if (*err != PCR_ERROR_NONE)
    return NULL;
  
  memset(resource_data, 0, sizeof(struct resource_data));
  
  resource_data->type = RESOURCE_TYPE_STRINGS;
  
  resource_data->data_entry.codepage = lang.codepage;
  resource_data->data_entry.size = MAX_STRINGS_PER_LEAF * 2; 

  // create empty strings until offset is reached
  resource_data->strings = (char **)pcr_malloc(sizeof(char *) * MAX_STRINGS_PER_LEAF, err);
  
  if (*err != PCR_ERROR_NONE)
  {
    free(resource_data);
    return NULL;
  }
  
  for (i=0; i<MAX_STRINGS_PER_LEAF; i++)
  {
    resource_data->strings[i] = (char *)pcr_malloc(sizeof(char), err);
    
    if (*err != PCR_ERROR_NONE)
      break;
    
    resource_data->strings[i][0] = '\0';
  }
  
  if (*err != PCR_ERROR_NONE)
  {
    for (j=0; j<i; j++)
      free(resource_data->strings[j]);
    free(resource_data->strings);
    free(resource_data);
    return NULL;
  }
  
  resource_data->number_of_strings = MAX_STRINGS_PER_LEAF;
  
  return resource_data;
}

/**
 * 
 */
struct resource_tree_node *pcr_create_rsrc_id_node_at(struct resource_tree_node *root, 
                                                      uint32_t id, pcr_error_code *err) 
{
  struct resource_tree_node *node;
  
  node = pcr_create_rsrc_tree_node(err);
  
  if (*err != PCR_ERROR_NONE)
    return NULL;
  
  node->id = id;
  
  pcr_add_rsrc_node(root, node, err);
  
  return node;
}

/*
 * free
 */

/**
 * 
 */
void pcr_free(struct pcr_file* pcr_file)
{
  if (pcr_file)
  {
    free(pcr_file->rm_stub);
  
    int i;
    for (i=0; i< pcr_file->image_file_header.number_of_sections; i++)
      free(pcr_file->section_data[i]);
    
    free(pcr_file->section_data);
    
    free(pcr_file->image_optional_header32);
    free(pcr_file->section_table);
    
    if (pcr_file->rsrc_section_data)
    {
      free(pcr_file->rsrc_section_data->language_info.array);
      pcr_free_resource_tree_node(pcr_file->rsrc_section_data->root_node);
      free(pcr_file->rsrc_section_data);
    }
  }
  
  free(pcr_file);
    
}

/**
 * 
 */
void pcr_free_resource_tree_node(struct resource_tree_node *node)
{
  int i;
  
  if (node == NULL)
    return;
  
  for (i=0; i<node->directory_table.number_of_name_entries; i++)
    pcr_free_resource_tree_node(node->name_entries[i]);
  
  free(node->name_entries);
  
  for (i=0; i<node->directory_table.number_of_id_entries; i++)
    pcr_free_resource_tree_node(node->id_entries[i]);
  
  free(node->id_entries);
  
  pcr_free_resource_data(node->resource_data);
  
  free(node->name);
  
  free(node);
  
}

/**
 * 
 */
void pcr_free_resource_data(struct resource_data *resource_data)
{
  if (resource_data != NULL)
  {
    int i;
    for (i=0; i<resource_data->number_of_strings; i++)
       free(resource_data->strings[i]);
    
    free(resource_data->strings);
    free(resource_data->raw_data);
    free(resource_data);
  }
}

/*
 * access functions
 */

void pcr_update_language_info(struct language_info_array *lang_info_array, uint32_t language_id, uint32_t codepage, pcr_error_code *err)
{
  struct language_info key, *ptr = NULL;
  
  key.lang.id = language_id;
  key.lang.codepage = codepage;
  key.item_count = 1;
  
  ptr = (struct language_info*)bsearch(&key, lang_info_array->array, lang_info_array->count, 
                                      sizeof(struct language_info), pcr_comp_language_info);
  
  if (ptr)
  {
    ptr->item_count ++;
  }
  else
  {
    lang_info_array->array = (struct language_info *)pcr_realloc(lang_info_array->array, sizeof(struct language_info), err);
    
    lang_info_array->array[lang_info_array->count] = key;
    lang_info_array->count ++;
    
    qsort(lang_info_array->array, lang_info_array->count, sizeof(struct language_info), pcr_comp_language_info);
  }
    
}

/**
 * Count a language with id in the language_info_array.
 */
unsigned int pcr_get_language_count(const struct pcr_file *pf, uint32_t language_id)
{
  const struct language_info_array *linfo = pcr_get_language_info(pf);
  unsigned int i, lang_cnt = 0;
  
  for (i=0; i < linfo->count; i++)
      if (language_id == linfo->array[i].lang.id)
        lang_cnt ++;
      
  return lang_cnt;
}

/**
 * @return NULL if not found or language_count > 1
 */
const struct pcr_language * pcr_get_language(const struct pcr_file *pf, uint32_t language_id)
{
  struct language_info key, *ptr = NULL;
  const struct language_info_array *lang_info_array = pcr_get_language_info(pf);
  key.lang.id = language_id;
  
  if (pcr_get_language_count(pf, language_id) != 1)
    return NULL;
  
  ptr = (struct language_info*)bsearch(&key, lang_info_array->array, lang_info_array->count,
                                       sizeof(struct language_info), pcr_comp_language_info_without_cp);
  return (ptr) ? &ptr->lang : NULL;
}

/**
 * Get section header by name. Returns NULL if not found.
 */
struct image_section_header * pcr_get_section_header(struct pcr_file *pfile, const char *name)
{
  int i;
  
  for (i=0; i<pfile->image_file_header.number_of_sections; i++)
    if (strcmp(name, pfile->section_table[i].name) == 0)
      return &pfile->section_table[i];
    
  return NULL;
}

/**
 * returns id node or NULL if unable to get it
 */
struct resource_tree_node* pcr_get_sub_id_node(const struct resource_tree_node *node, uint32_t id)
{
  struct resource_tree_node key, *kptr, **result = NULL;

  if (node && node->directory_table.number_of_id_entries > 0)
  {
    key.id = id;
    kptr = &key;
  
    result = (struct resource_tree_node **)bsearch(&kptr, node->id_entries, node->directory_table.number_of_id_entries, 
                  sizeof(struct resource_tree_node **), pcr_comp_id_tree_nodes);
  }
  
  if (result == NULL)
    return NULL;
  else
    return *result;
}

/**
 * returns name node or NULL if unable to get it
 */
struct resource_tree_node* pcr_get_sub_name_node(const struct resource_tree_node *node, const char *name)
{
  struct resource_tree_node key, *kptr, **result = NULL;
  pcr_error_code err = PCR_ERROR_NONE;
  
  if (node && node->directory_table.number_of_name_entries > 0)
  {
    key.name = (char *)pcr_malloc(strlen(name), &err);
    
    strcpy(key.name, name); 
    kptr = &key;
  
    result = (struct resource_tree_node **)bsearch(&kptr, node->name_entries, node->directory_table.number_of_name_entries, 
                  sizeof(struct resource_tree_node **), pcr_comp_name_tree_nodes);
    
    free(key.name);
  }
  
  if (result == NULL)
    return NULL;
  else
    return *result;
}

/**
 * Returns NULL if not found.
 */
struct resource_tree_node *pcr_get_rsrc_string_node_by_id(const struct pcr_file *file, uint32_t id)
{
  if (file == NULL)
  {
    printf("Resource file pointer is NULL!\n");
    return NULL;
  }
  
  struct resource_tree_node *string_dir;
  
  string_dir = pcr_get_sub_id_node(file->rsrc_section_data->root_node, RESOURCE_TYPE_STRINGS);
  
  return pcr_get_sub_id_node(string_dir, id);
}

/**
 * TODO error handling
 */
void pcr_add_rsrc_node(struct resource_tree_node *root, struct resource_tree_node *child, pcr_error_code *err)
{
  uint16_t num_id_entries;
  
  if (*err != PCR_ERROR_NONE)
    return;
  
  if (child->name == NULL)
  {
    if (pcr_get_sub_id_node(root, child->id) != NULL)
      printf("Error: There is already a node with given id!\n");
    else
    {
      num_id_entries = root->directory_table.number_of_id_entries;
      num_id_entries ++;
      
      struct resource_tree_node **id_entries_new = (struct resource_tree_node **)
        pcr_realloc(root->id_entries, num_id_entries * sizeof(struct resource_tree_node *), err);
        
      if (*err == PCR_ERROR_NONE)
      {
        root->id_entries = id_entries_new;
        root->directory_table.number_of_id_entries = num_id_entries;
        
        root->id_entries[num_id_entries - 1] = child;
        
        qsort(root->id_entries, num_id_entries, sizeof(struct resource_tree_node *),
              pcr_comp_id_tree_nodes);
        
      }
    }
  }
  else
  {
    printf("Warning: Adding named nodes is not supported yet!\n"); //TODO
  }
}

/**
 * 
 */
const struct language_info_array* pcr_get_language_info(const struct pcr_file *pfile)
{
  if (pfile && pfile->rsrc_section_data)
    return &pfile->rsrc_section_data->language_info;
  else
    return NULL;
}

/**
 *
 */
const struct pcr_language *pcr_get_default_language(const struct pcr_file *pfile)
{
  return pfile->rsrc_section_data->default_language;
}

/**
 *
 */
void pcr_set_default_language(struct pcr_file* pf, uint32_t language_id)
{
  //TODO implement
}

/**
 *
 */
void pcr_set_default_languageL(struct pcr_file *pf, struct pcr_language lang)
{
  //TODO implement
}

/**
 *
 */
extern uint32_t pcr_get_codepage(const struct pcr_file *pf, uint32_t string_id)
{
  const struct pcr_language *lang = pcr_get_default_language(pf);
  
  if (!lang)
    return (uint32_t)PCR_RET_ERR_LANG_NOT_SET;
  else
    return pcr_get_codepageL(pf, string_id, lang->id);
}

/**
 *
 */
uint32_t pcr_get_codepageL(const struct pcr_file *pf, uint32_t string_id, uint32_t language_id)
{
  struct rsrc_string_ptr rsptr = pcr_get_string_ptr(pf, string_id, language_id);
  
  if (rsptr.codepage != (uint32_t)-1) // Codepage set (string or lang dir found)
    return rsptr.codepage;
  
  if (pcr_get_language_count(pf, language_id) > 1) // language not unique
    return -1;
  
  // get language from info array
  const struct pcr_language *langptr = pcr_get_language(pf, language_id);
  
  return (langptr) ? langptr->codepage : (uint32_t)PCR_RET_ERR_LANG_NOT_SET;
}

/**
 *
 */
int32_t pcr_get_strlen (const struct pcr_file *pf, uint32_t id)
{
  const struct pcr_language *lang_info = pcr_get_default_language(pf);
  
  if (lang_info == NULL)
    return PCR_RET_ERR_LANG_NOT_SET;
  else
    return pcr_get_strlenL(pf, id, lang_info->id);
}

/**
 *
 */
uint16_t pcr_get_strlenL (const struct pcr_file *pf, uint32_t id, uint32_t language_id)
{
  struct rsrc_string_ptr rsptr = pcr_get_string_ptr(pf, id, language_id);
  
  if (rsptr.sptr == NULL)
    return 0;
  else
    return strlen(*rsptr.sptr);
}

/**
 * Get a pointer to a resource string. Also puts string pointer into cache.
 * 
 * @returns string or .sptr = NULL if not found.
 *          codepage = -1 if not set. Codepage will be set, if lang_dir is found.
 */
struct rsrc_string_ptr pcr_get_string_ptr (const struct pcr_file *pf, uint32_t id, uint32_t language_id)
{
  uint32_t resource_directory_id, offset;
  struct resource_tree_node *name_dir = NULL, *lang_dir = NULL;
  struct rsrc_string_ptr rsptr, *cached_rsptr;
  
  cached_rsptr = &pf->rsrc_section_data->rsrc_string_cache;
  
  if (cached_rsptr->id == id && cached_rsptr->language_id == language_id)
  {
    rsptr = *cached_rsptr;
  }
  else
  {
    rsptr.sptr = NULL;
    rsptr.id = id;
    rsptr.language_id = language_id;
    rsptr.codepage = -1;
  }
  
  resource_directory_id = RSRC_STRING_NAME_DIR_ID(id);
  offset = RSRC_STRING_DATA_OFFSET(id);
  
  name_dir = pcr_get_rsrc_string_node_by_id(pf, resource_directory_id);
  
  if (name_dir)
  {
    lang_dir = pcr_get_sub_id_node(name_dir, language_id);
    
    if (lang_dir != NULL && lang_dir->resource_data != NULL)
    {
      rsptr.codepage = lang_dir->resource_data->data_entry.codepage;
      
      if (offset < lang_dir->resource_data->number_of_strings &&
          strlen(lang_dir->resource_data->strings[offset]) > 0)
        rsptr.sptr = &lang_dir->resource_data->strings[offset];
    }
  }
  
  pf->rsrc_section_data->rsrc_string_cache = rsptr;
  
  return rsptr;
}

/**
 * 
 */
int pcr_get_string(const struct pcr_file *pf, uint32_t id, char *dest, size_t n)
{
  const struct pcr_language *lang = pcr_get_default_language(pf);
  
  if (lang == NULL)
    return PCR_RET_ERR_LANG_NOT_SET;
  else
    return pcr_get_stringL(pf, id, lang->id, dest, n);
}

/**
 * 
 */
int pcr_get_stringL(const struct pcr_file *pf, uint32_t id, uint32_t language_id, char *dest, size_t n)
{
  struct rsrc_string_ptr sptr;
  
  const struct language_info_array *linfo = pcr_get_language_info(pf);
  struct pcr_language *lang = NULL;
  uint32_t i, lang_cnt = 0;
  
  const struct pcr_language *default_lang = pcr_get_default_language(pf);
  
  sptr = pcr_get_string_ptr(pf, id, language_id);
  
  if (default_lang != NULL && default_lang->id == language_id)
  {
      if (sptr.codepage != (uint32_t)-1 && sptr.codepage != default_lang->codepage)
        lang_cnt = 2; // codepage not unique
  }
  else
  {
    for (i=0; i < linfo->count; i++)
    {
      if (language_id == linfo->array[i].lang.id)
      {
        lang_cnt ++;
        
        if (lang == NULL)
          lang = &linfo->array[i].lang;
      }
    }
  }
  
  
  if (sptr.sptr != NULL)
    strncpy (dest, *sptr.sptr, n);
  else
    strncpy (dest, "\0", n); 
    
  return (lang_cnt > 1) ? 1 : 0;
  
}

/**
 * TODO error handling, BAD_ALLOC
 */
int pcr_set_stringC(struct pcr_file *pf, uint32_t id, struct pcr_language lang, const char *src)
{
  pcr_error_code err = PCR_ERROR_NONE;
  
  struct resource_tree_node *type_node, *name_node, *lang_node;
  struct resource_data *resource_data;
  
  uint32_t name_node_id, offset;
  
  if (!pf->rsrc_section_data)
  {
    printf("ERROR: There is no resource section data!\n");
    return PCR_ERROR_UNSUPPORTED;
  }
  
  name_node_id = RSRC_STRING_NAME_DIR_ID(id);
  offset = RSRC_STRING_DATA_OFFSET(id);
  
  type_node = pcr_get_sub_id_node(pf->rsrc_section_data->root_node, RESOURCE_TYPE_STRINGS);
  
  if (!type_node) // add rsrc_type node
    type_node = pcr_create_rsrc_id_node_at(pf->rsrc_section_data->root_node, RESOURCE_TYPE_STRINGS, &err);
  
  name_node = pcr_get_sub_id_node(type_node, name_node_id);
  
  if (!name_node) // add name node
    name_node = pcr_create_rsrc_id_node_at(type_node, name_node_id, &err);
  
  lang_node = pcr_get_sub_id_node(name_node, lang.id);
  
  if (!lang_node) // add lang node
    lang_node = pcr_create_rsrc_id_node_at(name_node, lang.id, &err);
  
  resource_data = lang_node->resource_data;
  
  if (!resource_data)
  {
    resource_data = pcr_create_rsrc_data(lang, &err);
    lang_node->resource_data = resource_data;
    
    pcr_update_language_info(&pf->rsrc_section_data->language_info, lang.id, lang.codepage, &err);
  }
  else 
  {
    if (resource_data->data_entry.codepage != lang.codepage)
      return -1;
  }
  
  // Extend string array, offset is < MAX_STRINGS_PER_LEAF (modulo)
  if (err != PCR_ERROR_NONE && offset >= resource_data->number_of_strings) 
  { //TODO test this!
    uint16_t new_number_of_strings = offset + 1;
    uint16_t i;
    
    resource_data->strings = (char **)pcr_realloc(resource_data->strings, 
                                                  sizeof(char *) * new_number_of_strings, &err);
    
    for (i=resource_data->number_of_strings; i<new_number_of_strings; i++)
    {
      resource_data->strings[i] = (char *)pcr_malloc(sizeof(char), &err);
      resource_data->strings[i][0] = '\0';
    }
  }
  
  char **dest_str = NULL;
  uint32_t src_len;
  int32_t len_diff;
  
  dest_str = &lang_node->resource_data->strings[offset];
  
  src_len = strlen(src);
  len_diff = src_len - strlen(*dest_str);
  
  if (src_len == 0)
  {
    free(*dest_str);
    
    *dest_str = (char *)pcr_malloc(sizeof(char), &err);
    *dest_str[0] = '\0';
  }
  else
  {
    *dest_str = (char *)pcr_realloc(*dest_str, src_len + 1, &err); //TODO err check
      
    strcpy(*dest_str, src);
  }
  
  lang_node->resource_data->data_entry.size += (len_diff*2); // *2 word alignmend
  
  
  return err;
}
